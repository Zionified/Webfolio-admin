import { Article, Tag } from "@/types"
import { QuestionCircleOutlined } from "@ant-design/icons"
import {
    Checkbox,
    FloatButton,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
} from "antd"
import { useEffect, useState, useRef } from "react"
import Vditor from "vditor"
import "vditor/dist/index.css"
import * as api from "@/requests"
import { useLoaderData, useNavigate } from "react-router-dom"

export const loader = async ({ params }: any) => {
    return {
        article: await api.getArticle(params.articleId),
        tags: await api.listTags(),
    }
}

const EditArticle = () => {
    const refEditor = useRef<HTMLDivElement>(null)
    const [vditor, setVditor] = useState<Vditor>()
    const [isModalEditArticleOpen, setIsModalEditArticleOpen] = useState(false)
    const [
        isModalEditArticleConfirmLoading,
        setIsModalEditArticleConfirmLoading,
    ] = useState(false)

    const [formEditArticle] = Form.useForm()
    const navigate = useNavigate()
    const loaderData = useLoaderData() as { article: Article; tags: Tag[] }
    const article = loaderData.article
    const tags = loaderData.tags

    useEffect(() => {
        if (refEditor.current) {
            const vd = new Vditor(refEditor.current, {
                cache: { enable: false },
                height: "100%",
                lang: "en_US",
                after: () => {
                    vd.setValue(article.markdown)
                    setVditor(vd)
                }
            })
            
        }
    }, [refEditor, setVditor])

    const updateArticle = async (values: any) => {
        try {
            setIsModalEditArticleConfirmLoading(true)
            await api.updateArticle(values.id, {
                title: values.title,
                tags: values.tags,
                markdown: vditor!.getValue(),
            })
            setIsModalEditArticleOpen(false)
            navigate("/articles")
        } catch (err) {
        } finally {
            setIsModalEditArticleConfirmLoading(false)
        }
    }

    return (
        <>
            <div id="markdown-editor" ref={refEditor}></div>
            {vditor && (
                <FloatButton.Group shape="circle" style={{ right: 24 }}>
                    <FloatButton
                        onClick={() => setIsModalEditArticleOpen(true)}
                    />
                    {/* <FloatButton.BackTop visibilityHeight={0} /> */}
                </FloatButton.Group>
            )}
            <Modal
                title="Edit Article"
                open={isModalEditArticleOpen}
                onOk={() => formEditArticle.submit()}
                onCancel={() => setIsModalEditArticleOpen(false)}
                confirmLoading={isModalEditArticleConfirmLoading}
                afterClose={() => formEditArticle.resetFields()}
            >
                <Form
                    name="formEditArticle"
                    form={formEditArticle}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    onFinish={(values) => {
                        updateArticle(values)
                    }}
                    initialValues={{
                        id: article.id,
                        title: article.title,
                        visible: article.visible,
                        tags: article.tags,
                    }}
                    autoComplete="off"
                >
                    <Form.Item label="id" name="id" hidden>
                        <InputNumber />
                    </Form.Item>

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

export const Component = EditArticle
export default EditArticle
