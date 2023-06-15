import PageCard from "@/components/PageCard"
import { Project, Tag as TTag } from "@/types"
import {
    Button,
    Checkbox,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    Table,
    Tag,
} from "antd"
import { ColumnsType } from "antd/es/table"
import * as api from "@/requests"
import { useLoaderData } from "react-router-dom"
import { useEffect, useState } from "react"
import styled from "@emotion/styled"
import { ExclamationCircleFilled } from "@ant-design/icons"

export const loader = async () => {
    return { projects: await api.listProjects(), tags: await api.listTags() }
}

const colors: string[] = [
    "magenta",
    "volcano",
    "gold",
    "cyan",
    "geekblue",
    "purple",
]

const IMG = styled.img`
    height: 40px;
    width: 40px;
`
const Projects = () => {
    const loaderData = useLoaderData() as { projects: Project[]; tags: TTag[] }
    const [projects, setProjects] = useState(loaderData.projects)
    const [tags] = useState(loaderData.tags)

    const [isModalAddProjectOpen, setIsModalAddProjectOpen] = useState(false)
    const [
        isModalAddProjectConfirmLoading,
        setIsModalAddProjectConfirmLoading,
    ] = useState(false)
    const [formAddProject] = Form.useForm()

    const [isModalEditProjectOpen, setIsModalEditProjectOpen] = useState(false)
    const [
        isModalEditProjectConfirmLoading,
        setIsModalEditProjectConfirmLoading,
    ] = useState(false)
    const [formEditProject] = Form.useForm()

    const [selectedProject, setSelectedProject] = useState<Project | null>(null)

    const showDeleteConfirm = (project: Project) => {
        Modal.confirm({
            title: "This action is not reversible.",
            icon: <ExclamationCircleFilled />,
            content: (
                <>
                    {`Are you sure to delete this experience (${project.title})?`}
                    <br />
                    {`This action is not reversible.`}
                </>
            ),
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: async () => {
                await api.deleteProject(project.id)
                refreshProjects()
            },
        })
    }

    const showModalEditProject = (project: Project) => {
        formEditProject.setFieldValue("id", project.id)
        formEditProject.setFieldValue("sort", project.sort)
        formEditProject.setFieldValue("title", project.title)
        formEditProject.setFieldValue("image", project.image)
        formEditProject.setFieldValue(
            "description",
            project.description.reduce((prev, curr) => prev.concat("\n", curr))
        )
        formEditProject.setFieldValue("visible", project.visible)
        formEditProject.setFieldValue("starCount", project.starCount)
        formEditProject.setFieldValue("installCount", project.installCount)
        formEditProject.setFieldValue("tags", project.tags)
        setIsModalEditProjectOpen(true)
    }

    const updateProject = async (values: any) => {
        try {
            setIsModalEditProjectConfirmLoading(true)
            const descriptionSplit = values.description.trimStart().split("\n")
            const visible = values.visible ? true : false
            await api.updateProject(values.id, {
                title: values.title,
                description: descriptionSplit,
                image: values.image,
                visible: visible,
                tags: values.tags,
                starCount: values.starCount,
                installCount: values.installCount,
            })
            setIsModalEditProjectOpen(false)
            // setSelectedProject(null)
            refreshProjects()
        } catch (err) {
        } finally {
            setIsModalEditProjectConfirmLoading(false)
        }
    }

    const columns: ColumnsType<Project> = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Sort",
            dataIndex: "sort",
        },
        {
            title: "Image",
            key: "image",
            render: (_, { image }) => <IMG src={image}></IMG>,
        },
        {
            title: "Project",
            dataIndex: "title",
        },
        {
            title: "Short Description",
            key: "descriptions",
            render: (_, { description }) => <>{description[0]}</>,
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
            title: "Tags",
            key: "tags",
            render: (_, { tags }) =>
                tags && (
                    <>
                        {tags.map((tag) => {
                            let color =
                                colors[
                                    Math.floor(Math.random() * colors.length)
                                ]
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
            title: "Star Count",
            key: "starCount",
            render: (_, { starCount }) => starCount && <>{starCount}</>,
        },
        {
            title: "Install Count",
            key: "installCount",
            render: (_, { installCount }) =>
                installCount && <>{installCount}</>,
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        onClick={() => showModalEditProject(record)}
                        type="link"
                    >
                        Edit
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

    const refreshProjects = async () => {
        setProjects(await api.listProjects())
    }

    const addProject = async (values: any) => {
        try {
            setIsModalAddProjectConfirmLoading(true)
            const name = values.title.split(/[:\s]+/)[0].toLowerCase()
            const descriptionSplit = values.description.trimStart().split("\n")
            const visible = values.visible ? true : false
            await api.addProject(
                values.title,
                name,
                descriptionSplit,
                values.image,
                visible,
                values.tags,
                values.starCount,
                values.installCount
            )
            setIsModalAddProjectOpen(false)
            refreshProjects()
        } catch (err) {
        } finally {
            setIsModalAddProjectConfirmLoading(false)
        }
    }
    return (
        <>
            <PageCard
                title="Projects"
                extra={
                    <Button onClick={() => setIsModalAddProjectOpen(true)}>
                        Add Project
                    </Button>
                }
            >
                <Table columns={columns} dataSource={projects} rowKey="id" />
            </PageCard>
            <Modal
                title="Add Project"
                open={isModalAddProjectOpen}
                onOk={() => formAddProject.submit()}
                onCancel={() => setIsModalAddProjectOpen(false)}
                confirmLoading={isModalAddProjectConfirmLoading}
                afterClose={() => formAddProject.resetFields()}
            >
                <Form
                    name="formAddProject"
                    form={formAddProject}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    onFinish={(values) => {
                        console.log(values)
                        addProject(values)
                    }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Project"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: "Please input your project title!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Image Link"
                        name="image"
                        rules={[
                            {
                                required: true,
                                message: "Please input your image link!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please input your project description!",
                            },
                        ]}
                    >
                        <Input.TextArea rows={12} />
                    </Form.Item>
                    <Form.Item
                        label="Visibility"
                        name="visible"
                        valuePropName="checked"
                    >
                        <Checkbox />
                    </Form.Item>
                    <Form.Item label="Star Count" name="starCount">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="Installation Count" name="installCount">
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
            <Modal
                title="Edit Project"
                open={isModalEditProjectOpen}
                onOk={() => formEditProject.submit()}
                onCancel={() => setIsModalEditProjectOpen(false)}
                confirmLoading={isModalEditProjectConfirmLoading}
                afterClose={() => formEditProject.resetFields()}
            >
                {/* {selectedProject && ( */}
                <Form
                    name="formEditProject"
                    form={formEditProject}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    onFinish={(values) => {
                        console.log(values)
                        updateProject(values)
                    }}
                    // initialValues={{
                    //     id: selectedProject.id,
                    //     sort: selectedProject.sort,
                    //     title: selectedProject.title,
                    //     image: selectedProject.image,
                    //     description: selectedProject.description.reduce(
                    //         (prev, curr) => prev.concat("\n", curr)
                    //     ),
                    //     visible: selectedProject.visible,
                    //     starCount: selectedProject.starCount,
                    //     installCount: selectedProject.installCount,
                    //     tags: selectedProject.tags,
                    // }}
                    autoComplete="off"
                >
                    <Form.Item label="id" name="id" hidden>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="sort" name="sort" hidden>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        label="Project"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: "Please input your project name!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Image Link"
                        name="image"
                        rules={[
                            {
                                required: true,
                                message: "Please input your image link!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please input your project description!",
                            },
                        ]}
                    >
                        <Input.TextArea rows={12} />
                    </Form.Item>
                    <Form.Item
                        label="Visibility"
                        name="visible"
                        valuePropName="checked"
                    >
                        <Checkbox />
                    </Form.Item>
                    <Form.Item label="Star Count" name="starCount">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="Installation Count" name="installCount">
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
                {/* )} */}
            </Modal>
        </>
    )
}

export const Component = Projects
export default Projects
