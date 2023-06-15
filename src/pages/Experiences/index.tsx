import PageCard from "@/components/PageCard"
import { Experience, Tag as TTag } from "@/types"
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
import { useState } from "react"
import { useLoaderData } from "react-router-dom"
import * as api from "@/requests"
import { ExclamationCircleFilled } from "@ant-design/icons"

export const loader = async () => {
    return {
        experiences: await api.listExperiences(),
        tags: await api.listTags(),
    }
}

const colors: string[] = ["magenta", "volcano", "gold", "cyan", "geekblue", "purple"]

const Experiences = () => {
    const loaderData = useLoaderData() as {
        experiences: Experience[]
        tags: TTag[]
    }

    const [isModalAddExperienceOpen, setIsModalAddExperienceOpen] =
        useState(false)
    const [
        isModalAddExperienceConfirmLoading,
        setIsModalAddExperienceConfirmLoading,
    ] = useState(false)
    const [formAddExperience] = Form.useForm()

    const [isModalEditExperienceOpen, setIsModalEditExperienceOpen] =
        useState(false)
    const [
        isModalEditExperienceConfirmLoading,
        setIsModalEditExperienceConfirmLoading,
    ] = useState(false)
    const [formEditExperience] = Form.useForm()

    const [experiences, setExperiences] = useState(loaderData.experiences)
    const [tags] = useState(loaderData.tags)

    const [selectedExperience, setSelectedExperience] =
        useState<Experience | null>(null)
    const showDeleteConfirm = (experience: Experience) => {
        Modal.confirm({
            title: "This action is not reversible.",
            icon: <ExclamationCircleFilled />,
            content: (
                <>
                    {`Are you sure to delete this experience (${experience.company})?`}
                    <br />
                    {`This action is not reversible.`}
                </>
            ),
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: async () => {
                await api.deleteExperience(experience.id)
                refreshExperience()
            },
        })
    }

    const showModalEditExperience = (experience: Experience) => {
        setSelectedExperience(experience)
        setIsModalEditExperienceOpen(true)
    }

    const updateExperience = async (values: any) => {
        try {
            setIsModalEditExperienceConfirmLoading(true)
            await api.updateExperience(values.id, {
                company: values.company,
                timeline: values.timeline,
                description: (values.description).trimStart().split("\n"),
                visible: values.visible ? true : false,
                roles: values.roles,
                tags: values.tags,
            })
            setIsModalEditExperienceOpen(false)
            setSelectedExperience(null)
            refreshExperience()
        } catch (err) {
        } finally {
            setIsModalEditExperienceConfirmLoading(false)
        }
    }

    const columns: ColumnsType<Experience> = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Sort",
            dataIndex: "sort",
        },
        {
            title: "Company",
            dataIndex: "company",
        },
        {
            title: "Timeline",
            dataIndex: "timeline",
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
            title: "Roles",
            key: "roles",
            render: (_, { roles }) => (
                <>
                    {roles.map((role) => {
                        let color = colors[Math.floor(Math.random() * colors.length)]
                        return (
                            <Tag color={color} key={role}>
                                {role}
                            </Tag>
                        )
                    })}
                </>
            ),
        },
        {
            title: "Tags",
            key: "tags",
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = colors[Math.floor(Math.random() * colors.length)]
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
                        onClick={() => showModalEditExperience(record)}
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

    const refreshExperience = async () => {
        setExperiences(await api.listExperiences())
    }

    const addExperience = async (values: any) => {
        try {
            setIsModalAddExperienceConfirmLoading(true)
            const descriptionSplit = values.description.trimStart().split("\n")
            const visible = values.visible ? true : false
            await api.addExperience(
                values.company,
                values.timeline,
                descriptionSplit,
                visible,
                values.roles,
                values.tags
            )
            setIsModalAddExperienceOpen(false)
            refreshExperience()
        } catch (err) {
        } finally {
            setIsModalAddExperienceConfirmLoading(false)
        }
    }
    return (
        <>
            <PageCard
                title="Experiences"
                extra={
                    <Button onClick={() => setIsModalAddExperienceOpen(true)}>
                        Add Experience
                    </Button>
                }
            >
                <Table columns={columns} dataSource={experiences} rowKey="id" />
            </PageCard>
            <Modal
                title="Add Experience"
                open={isModalAddExperienceOpen}
                onOk={() => formAddExperience.submit()}
                onCancel={() => setIsModalAddExperienceOpen(false)}
                confirmLoading={isModalAddExperienceConfirmLoading}
                afterClose={() => formAddExperience.resetFields()}
            >
                <Form
                    name="formAddExperience"
                    form={formAddExperience}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    onFinish={(values) => {
                        // console.log(values)
                        addExperience(values)
                    }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Company"
                        name="company"
                        rules={[
                            {
                                required: true,
                                message: "Please input your company name!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Timeline"
                        name="timeline"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please input your experience timeline!",
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
                                    "Please input your experience description!",
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
                    <Form.Item
                        label="Roles"
                        name="roles"
                        rules={[
                            {
                                required: true,
                                message: "Please input your role!",
                            },
                        ]}
                    >
                        <Select mode="tags" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Tags"
                        name="tags"
                        rules={[
                            {
                                required: true,
                                message: "Please input your tags!",
                            },
                        ]}
                    >
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
                title="Edit Experience"
                open={isModalEditExperienceOpen}
                onOk={() => formEditExperience.submit()}
                onCancel={() => setIsModalEditExperienceOpen(false)}
                confirmLoading={isModalEditExperienceConfirmLoading}
            >
                {selectedExperience && (
                    <Form
                        name="formEditExperience"
                        form={formEditExperience}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        onFinish={(values) => {
                            // console.log(values)
                            updateExperience(values)
                        }}
                        initialValues={{
                            id: selectedExperience.id,
                            sort: selectedExperience.sort,
                            company: selectedExperience.company,
                            timeline: selectedExperience.timeline,
                            description: selectedExperience.description.reduce(
                                (prev, curr) => prev.concat("\n", curr)
                            ),
                            visible: selectedExperience.visible,
                            roles: selectedExperience.roles,
                            tags: selectedExperience.tags,
                        }}
                        autoComplete="off"
                    >
                        <Form.Item label="id" name="id" hidden>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item label="sort" name="sort" hidden>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item
                            label="Company"
                            name="company"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your company name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Timeline"
                            name="timeline"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please input your experience timeline!",
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
                                        "Please input your experience description!",
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
                        <Form.Item
                            label="Roles"
                            name="roles"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your role!",
                                },
                            ]}
                        >
                            <Select mode="tags" style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item
                            label="Tags"
                            name="tags"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your tags!",
                                },
                            ]}
                        >
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
                )}
            </Modal>
        </>
    )
}

export const Component = Experiences
export default Experiences
