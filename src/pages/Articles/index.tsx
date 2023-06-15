import {
    Button,
    Form,
    InputNumber,
    Modal,
    Select,
    Space,
    Table,
    Tag,
} from "antd"
import { ColumnsType } from "antd/es/table"
import type { Article, Tag as TTag } from "@/types"
import PageCard from "@/components/PageCard"
import { ExclamationCircleFilled } from "@ant-design/icons"
import { useState } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"
import * as api from "@/requests"

export const loader = async () => {
    // return await api.listArticles()
    return { articles: await api.listArticles(), tags: await api.listTags() }
}
const Articles = () => {
    const loaderData = useLoaderData() as { articles: Article[]; tags: TTag[] }
    const [articles, setArticles] = useState(loaderData.articles)

    const [tags] = useState(loaderData.tags)
    const [isModalEditTagsOpen, setIsModalEditTagsOpen] = useState(false)
    const [isModalEditTagsConfirmLoading, setIsModalEditTagsConfirmLoading] =
        useState(false)
    const [formEditTags] = Form.useForm()

    const navigate = useNavigate()

    const columns: ColumnsType<Article> = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Titles",
            dataIndex: "title",
        },
        {
            title: "Visibility",
            key: "visible",
            render: (_, { visible }) => (
                <Tag color={!visible ? "red" : "green"}>
                    {visible ? "TRUE" : "FALSE"}
                </Tag>
            ),
        },
        {
            title: "Create Time",
            dataIndex: "createTime",
        },
        {
            title: "Tags",
            key: "tags",
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? "geekblue" : "green"
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        )
                    })}
                </>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        onClick={() => navigate(`/article/edit/${record.id}`)}
                        type="link"
                    >
                        Edit Article
                    </Button>
                    <Button
                        onClick={() => showModalArticleTags(record)}
                        type="link"
                    >
                        Edit Tags
                    </Button>
                    <Button
                        type="link"
                        onClick={() => updateArticleVisibility(record)}
                    >
                        {record.visible ? "Hide" : "Show"}
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

    const refreshArticles = async () => {
        const articles = await api.listArticles()
        setArticles(articles)
    }

    const showDeleteConfirm = (article: Article) => {
        Modal.confirm({
            title: "This action is not reversible.",
            icon: <ExclamationCircleFilled />,
            content: (
                <>
                    {`Are you sure to delete this article (${article.title})?`}
                    <br />
                    {`This action is not reversible.`}
                </>
            ),
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: async () => {
                await api.deleteArticle(article.id)
                refreshArticles()
            },
        })
    }

    const updateArticleVisibility = async (article: Article) => {
        try {
            await api.updateArticle(article.id, { visible: !article.visible })
            refreshArticles()
        } catch (err) {}
    }

    const showModalArticleTags = async (article: Article) => {
        formEditTags.setFieldValue("id", article.id)
        formEditTags.setFieldValue("tags", article.tags)
        setIsModalEditTagsOpen(true)
    }

    const updateArticleTags = async (articleId: number, tags: string[]) => {
        try {
            console.log(articleId, tags)
            setIsModalEditTagsConfirmLoading(true)
            await api.updateArticle(articleId, { tags: tags })
            setIsModalEditTagsOpen(false)
            refreshArticles()
        } catch (err) {
        } finally {
            setIsModalEditTagsConfirmLoading(false)
        }
    }

    return (
        <>
            <PageCard
                title="Articles"
                extra={
                    <Button onClick={() => navigate("/article/add")}>
                        Add Article
                    </Button>
                }
            >
                <Table columns={columns} dataSource={articles} rowKey="id" />
            </PageCard>
            <Modal
                title="Edit Tag"
                open={isModalEditTagsOpen}
                onOk={() => formEditTags.submit()}
                onCancel={() => setIsModalEditTagsOpen(false)}
                confirmLoading={isModalEditTagsConfirmLoading}
                afterClose={() => formEditTags.resetFields()}
            >
                <Form
                    name="formEditTags"
                    form={formEditTags}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    onFinish={(values) => {
                        updateArticleTags(values.id, values.tags)
                    }}
                    autoComplete="off"
                >
                    <Form.Item label="id" name="id" hidden>
                        <InputNumber />
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

export const Component = Articles
export default Articles
