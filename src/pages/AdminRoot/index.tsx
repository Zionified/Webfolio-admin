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
            <Layout
                className={css`
                    height: calc(100vh-64px);
                `}
            >
                <SideBar/>
                <Content
                    className={css`
                        background: #fff;
                        padding: 20px 40px;
                        height: 100%;
                        overflow-y: scroll;
                    `}
                >
                    <Outlet></Outlet>
                </Content>
            </Layout>
        </Layout>
    )
}

export default Root
