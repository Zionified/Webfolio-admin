import { Navigate, createBrowserRouter, redirect } from "react-router-dom"
import Login from "./pages/Login"
import Root from "./pages/AdminRoot"
import { fetchLoginUser } from "./requests/user"

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login></Login>,
    },
    {
        path: "/",
        element: <Root />,
        id: "root",
        loader: async () => {
            try {
                return await fetchLoginUser()
            } catch (err) {
                return redirect("/login")
            }
        },
        children: [
            {
                path: "about",
                lazy: () => import("./pages/About"),
            },
            {
                path: "articles",
                lazy: () => import("./pages/Articles"),
            },
            {
                path: "article/add",
                lazy: () => import("./pages/AddArticle"),
            },
            {
                path: "article/edit/:articleId",
                lazy: () => import("./pages/EditArticle"),
            },
            {
                path: "experiences",
                lazy: () => import("./pages/Experiences"),
            },
            {
                path: "projects",
                lazy: () => import("./pages/Projects"),
            },
            {
                path: "tags",
                lazy: () => import("./pages/Tags"),
            },
            {
                index: true,
                element: <Navigate to="/about" replace={true} />,
            },
        ],
    },
])

export default router
