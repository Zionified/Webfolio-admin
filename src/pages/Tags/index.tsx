import { Button, Form, Input, Modal, Space, Table, message } from "antd"
import { ColumnsType } from "antd/es/table"
import type { Tag } from "@/types"
import PageCard from "@/components/PageCard"
import { ExclamationCircleFilled } from "@ant-design/icons"
import { useState } from "react"
import { useLoaderData } from "react-router-dom"
import * as api from "@/requests"

export const loader = async () => {
    return await api.listTags()
}

const Tags = () => {
    const [tags, setTags] = useState(useLoaderData() as Tag[])

    const refreshTags = async () => {
        setTags(await api.listTags())
    }
    const showDeleteConfirm = (tag: Tag) => {
        Modal.confirm({
            title: "This action is not reversible.",
            icon: <ExclamationCircleFilled />,
            content: (
                <>
                    {`Are you sure to delete this tag (${tag.tag})?`}
                    <br />
                    {`This action is not reversible.`}
                </>
            ),
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: async () => {
                await api.deleteTag(tag.tag)
                message.success("Deleted successfully")
                refreshTags()
            },
        })
    }

    const [isModalAddTagOpen, setIsModalAddTagOpen] = useState(false)
    const [isModalAddTagConfirmLoading, setIsModalAddTagConfirmLoading] =
        useState(false)
    const [formAddTag] = Form.useForm()

    const addTag = async (tag: string) => {
        try {
            setIsModalAddTagConfirmLoading(true)
            await api.addTag(tag)
            message.success("Added successfully")
            setIsModalAddTagOpen(false)
            refreshTags()
        } catch (err) {
        } finally {
            setIsModalAddTagConfirmLoading(false)
        }
    }

    const [isModalRenameTagOpen, setIsModalRenameTagOpen] = useState(false)
    const [isModalRenameTagConfirmLoading, setIsModalRenameTagConfirmLoading] =
        useState(false)
    const [formRenameTag] = Form.useForm()
    // const [selectedTag, setSelectedTag] = useState<Tag | null>(null)

    // 传参数记录共同数据
    const showModalRenameTag = (tag: Tag) => {
        // setSelectedTag(tag)
        // 要setFieldValue不然hidden的value是undefined
        formRenameTag.setFieldValue("originalTag", tag.tag)
        setIsModalRenameTagOpen(true)
    }

    const renameTag = async (originalTag: string, newTag: string) => {
        try {
            setIsModalRenameTagConfirmLoading(true)
            await api.renameTag(originalTag, newTag)
            message.success("Renamed successfully")
            setIsModalRenameTagOpen(false)
            // setSelectedTag(null)
            refreshTags()
        } catch (err) {
        } finally {
            setIsModalRenameTagConfirmLoading(false)
        }
    }

    const columns: ColumnsType<Tag> = [
        {
            title: "Tag",
            dataIndex: "tag",
        },
        {
            title: "Create Time",
            dataIndex: "createTime",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        onClick={() => showModalRenameTag(record)}
                    >
                        Rename
                    </Button>
                    <Button
                        onClick={() => showDeleteConfirm(record)}
                        type="link"
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ]

    return (
        <>
            <PageCard
                title="Tags"
                extra={
                    <Button onClick={() => setIsModalAddTagOpen(true)}>
                        Add Tag
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={tags}
                    rowKey="tag"
                    pagination={false}
                />
            </PageCard>
            <Modal
                title="Add Tag"
                open={isModalAddTagOpen}
                onOk={() => formAddTag.submit()}
                onCancel={() => setIsModalAddTagOpen(false)}
                confirmLoading={isModalAddTagConfirmLoading}
                afterClose={() => formAddTag.resetFields()}
            >
                <Form
                    name="formAddTag"
                    form={formAddTag}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    onFinish={(values) => {
                        addTag(values.tag)
                    }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tag"
                        name="tag"
                        rules={[
                            {
                                required: true,
                                message: "Please input your new tag!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Rename Tag"
                open={isModalRenameTagOpen}
                onOk={() => formRenameTag.submit()}
                onCancel={() => setIsModalRenameTagOpen(false)}
                confirmLoading={isModalRenameTagConfirmLoading}
                afterClose={() => formRenameTag.resetFields()}
            >
                <Form
                    name="formRenameTag"
                    form={formRenameTag}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    onFinish={(values) => {
                        // console.log(values)
                        renameTag(values.originalTag, values.newTag)
                    }}
                    autoComplete="off"
                >
                    <Form.Item label="Original Tag" name="originalTag" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Tag"
                        name="newTag"
                        rules={[
                            {
                                required: true,
                                message: "Please input your new tag!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export const Component = Tags
export default Tags
