import { Button, Checkbox, Form, Input, message } from "antd"
import { login } from "@/requests/user"
import { useNavigate } from "react-router-dom"
import styled from "@emotion/styled"

const Container = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 300px;
`
const Login = () => {
    const navigate = useNavigate()
    const onFinish = async ({
        username,
        password,
    }: {
        username: string
        password: string
    }) => {
        await login(username, password)
        message.success("login successful!")
        navigate("/")
    }

    return (
        <Container>
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12, offset: 1 }}
                style={{ width: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: "Please input your username!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your password!",
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{ offset: 5, span: 12 }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 5, span: 12 }}>
                    <Button type="primary" htmlType="submit" block>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Container>
    )
}

export default Login
