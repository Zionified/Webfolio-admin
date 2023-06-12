import { css } from "@emotion/css"
import { Layout } from "antd"
import { Content, Header } from "antd/es/layout/layout"
import { Outlet } from "react-router-dom"
import UserControl from "./UserControl"
import SideBar from "./Sider"

const Root = () => {
    return (
        <Layout
            className={css`
                height: 100vh;
            `}
        >
            <Header
                className={css`
                    display: flex;
                    flex-direction: row-reverse;
                    align-items: center;
                `}
            >
                <UserControl></UserControl>
            </Header>
            <Layout>
                <SideBar />
                <Content
                    className={css`
                        background: #fff;
                        padding: 20px 40px;
                    `}
                >
                    <Outlet></Outlet>
                </Content>
            </Layout>
        </Layout>
    )
}

export default Root
