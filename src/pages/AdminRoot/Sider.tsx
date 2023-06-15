import {
    FileOutlined,
    FileTextOutlined,
    PaperClipOutlined,
    TagsOutlined,
    ToolOutlined,
} from "@ant-design/icons"
import { css } from "@emotion/css"
import { Layout, Menu, MenuProps } from "antd"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

type MenuItem = Required<MenuProps>["items"][number]

const items: MenuItem[] = [
    {
        key: "/about",
        icon: <FileOutlined />,
        label: "About",
    },
    {
        key: "/articles",
        icon: <FileTextOutlined />,
        label: "Articles",
    },
    {
        key: "/experiences",
        icon: <PaperClipOutlined />,
        label: "Experiences",
    },
    {
        key: "/projects",
        icon: <ToolOutlined />,
        label: "Projects",
    },
    {
        key: "/tags",
        icon: <TagsOutlined />,
        label: "Tags",
    },
]

const SideBar = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const onMenuItemClick: MenuProps["onClick"] = ({ key }) => {
        if (location.pathname !== key) {
            navigate(key)
        }
    }

    const [menuSelectedKeys, setMenuSelectedKeys] = useState<string[]>([
        location.pathname,
    ])

    useEffect(() => {
        setMenuSelectedKeys([location.pathname])
    }, [location])

    return (
        <Layout.Sider
            className={css`
                height: 100%;
            `}
        >
            <Menu
                selectedKeys={menuSelectedKeys}
                mode="inline"
                theme="dark"
                items={items}
                onClick={onMenuItemClick}
                className={css`
                    height: 100%;
                `}
            />
        </Layout.Sider>
    )
}

export default SideBar
