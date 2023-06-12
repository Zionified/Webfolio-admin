import { User } from "@/types"
import { css } from "@emotion/css"
import styled from "@emotion/styled"
import { Avatar, Dropdown, Form, Input, MenuProps, Modal, message } from "antd"
import { useNavigate, useRouteLoaderData } from "react-router-dom"
import * as api from "@/requests/user"
import { useState } from "react"
const DropdownItem = styled.div`
    text-align: center;
`

const UserControl = () => {
    const navigate = useNavigate()

    const [isModalUpdateUserInfoOpen, setIsModalUpdateUserInfoOpen] =
        useState(false)
    const [
        isModalUpdateUserInfoConfirmLoading,
        setIsModalUpdateUserInfoConfirmLoading,
    ] = useState(false)
    const [formUpdateUserInfo] = Form.useForm()

    // 数据单向流动只能靠setUser来生效，mock中改的不生效
    const [user, setUser] = useState(useRouteLoaderData("root") as User)
    const refreshUserInfo = async () => {
        setUser(await api.fetchLoginUser())
    }

    const logout = async () => {
        await api.logout()
        navigate("/login")
    }

    const updateUserInfo = async (nickname: string) => {
        try {
            setIsModalUpdateUserInfoConfirmLoading(true)
            await api.updateUserInfo(nickname)
            setIsModalUpdateUserInfoOpen(false)
            message.success("Updated!")
            refreshUserInfo()
        } catch (err) {
            message.error("Something went wrong!")
        } finally {
            setIsModalUpdateUserInfoConfirmLoading(false)
        }
    }

    const [isModalChangingPasswordOpen, setIsModalChangingPasswordOpen] =
        useState(false)
    const [
        isModalChangingPasswordConfirmLoading,
        setIsModalChangingPasswordConfirmLoading,
    ] = useState(false)
    const [formChangingPassword] = Form.useForm()

    const updateUserPassword = async (newPassword: string) => {
        try {
            setIsModalChangingPasswordConfirmLoading(true)
            await api.updateUserPassword(newPassword)
            setIsModalChangingPasswordOpen(false)
            message.success("Updated!")
        } catch {
        } finally {
            setIsModalChangingPasswordConfirmLoading(false)
        }
    }

    const items: MenuProps["items"] = [
        {
            key: "welcome",
            label: (
                <DropdownItem>
                    Welcome, {user.nickname ? user.nickname : user.username}!
                </DropdownItem>
            ),
        },
        {
            key: "changePassword",
            label: (
                <DropdownItem
                    onClick={() => setIsModalChangingPasswordOpen(true)}
                >
                    Change Password
                </DropdownItem>
            ),
        },
        {
            key: "updateUserInfo",
            label: (
                <DropdownItem
                    onClick={() => setIsModalUpdateUserInfoOpen(true)}
                >
                    Update User Info
                </DropdownItem>
            ),
        },
        {
            key: "logout",
            label: <DropdownItem onClick={logout}>Logout</DropdownItem>,
        },
    ]

    return (
        <>
            <Dropdown
                menu={{ items }}
                placement="bottom"
                arrow
                trigger={["click"]}
            >
                {user.avatar ? (
                    <Avatar src={user.avatar} size="large"></Avatar>
                ) : (
                    <Avatar
                        className={css`
                            background-color: rgb(245, 106, 0);
                            text-transform: uppercase;
                        `}
                        size="large"
                    >
                        {user.nickname
                            ? user.nickname.substring(0, 1)
                            : user.username.substring(0, 1)}
                    </Avatar>
                )}
            </Dropdown>
            <Modal
                title="Update User Info"
                open={isModalUpdateUserInfoOpen}
                onOk={() => formUpdateUserInfo.submit()}
                onCancel={() => setIsModalUpdateUserInfoOpen(false)}
                confirmLoading={isModalUpdateUserInfoConfirmLoading}
                afterClose={() => formUpdateUserInfo.resetFields()}
            >
                <Form
                    name="formUpdateUserInfo"
                    form={formUpdateUserInfo}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    onFinish={(values) => {
                        updateUserInfo(values.nickname)
                    }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Nickname"
                        name="nickname"
                        rules={[
                            {
                                required: true,
                                message: "Please input your new nickname!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Change Password"
                open={isModalChangingPasswordOpen}
                onOk={() => formChangingPassword.submit()}
                onCancel={() => setIsModalChangingPasswordOpen(false)}
                confirmLoading={isModalChangingPasswordConfirmLoading}
                afterClose={() => formChangingPassword.resetFields()}
            >
                <Form
                    name="formChangingPassword"
                    form={formChangingPassword}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    onFinish={(values) => {
                        updateUserPassword(values.newPassword)
                    }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            {
                                required: true,
                                message: "Please input your new password!",
                            },
                            {
                                min: 3,
                                max: 32,
                                message: "Invalid length",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        rules={[
                            {
                                required: true,
                                message: "Please confirm your password!",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("newPassword") === value
                                    ) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "The new password that you entered do not match!"
                                        )
                                    )
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default UserControl
