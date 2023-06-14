import { Tag } from "@/types"
import { Checkbox, FloatButton, Form, Input, Modal, Select } from "antd"
import { useEffect, useState, useRef } from "react"
import Vditor from "vditor"
import "vditor/dist/index.css"
import * as api from "@/requests"
import { useLoaderData, useNavigate } from "react-router-dom"

export const loader = async () => {
    return await api.listTags()
}

const AddArticle = () => {
    const refEditor = useRef<HTMLDivElement>(null)
    const [vditor, setVditor] = useState<Vditor>()
    const [isModalAddArticleOpen, setIsModalAddArticleOpen] = useState(false)
    const [
        isModalAddArticleConfirmLoading,
        setIsModalAddArticleConfirmLoading,
    ] = useState(false)
    const tags = useLoaderData() as Tag[]
    const [formAddArticle] = Form.useForm()
    const navigate = useNavigate()

    useEffect(() => {
        if (refEditor.current) {
            const vd = new Vditor(refEditor.current, {
                cache: { enable: false },
                height: "100%",
                input: (value) => {},
                lang: "en_US",
                after: () => {
                    setVditor(vd)
                },
            })
        }
    }, [refEditor, setVditor])

    const addArticle = async (values: any) => {
        try {
            setIsModalAddArticleConfirmLoading(true)
            await api.addArticle({
                title: values.title,
                tags: values.tags,
                markdown: vditor!.getValue(),
                visible: values.visible,
            })
            setIsModalAddArticleOpen(false)
            navigate("/articles")
        } catch (err) {
        } finally {
            setIsModalAddArticleConfirmLoading(false)
        }
    }

    return (
        <>
            <div id="markdown-editor" ref={refEditor}></div>
            {vditor && (
                <FloatButton.Group shape="circle" style={{ right: 24 }}>
                    <FloatButton
                        onClick={() => setIsModalAddArticleOpen(true)}
                    />
                    {/* <FloatButton.BackTop visibilityHeight={0} /> */}
                </FloatButton.Group>
            )}
            <Modal
                title="Add Article"
                open={isModalAddArticleOpen}
                onOk={() => formAddArticle.submit()}
                onCancel={() => setIsModalAddArticleOpen(false)}
                confirmLoading={isModalAddArticleConfirmLoading}
                afterClose={() => formAddArticle.resetFields()}
            >
                <Form
                    name="formAddArticle"
                    form={formAddArticle}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    onFinish={(values) => {
                        addArticle(values)
                    }}
                    initialValues={{ title: "", visible: false, tags: [] }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: "Please input your article's title!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        valuePropName="checked"
                        label="Visibility"
                        name="visible"
                        hidden
                    >
                        <Checkbox />
                    </Form.Item>
                    <Form.Item label="Tags" name="tags">
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: "100%" }}
                            placeholder="Please select"
                            options={tags.map((tag) => {
                                return { label: tag.tag, value: tag.tag }
                            })}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export const Component = AddArticle
export default AddArticle
