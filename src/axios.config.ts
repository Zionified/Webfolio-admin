import axios from "axios"
import { RESPONSE } from "./consts"
import message from "antd/es/message"
import history from "./history"

// Add a request interceptor
axios.interceptors.request.use(
    function (config) {
        if (localStorage.getItem("__TOKEN")) {
            config.headers["Token"] = localStorage.getItem("__TOKEN")
        }
        return config
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error)
    }
)

// Add a response interceptor
axios.interceptors.response.use(
    function (response) {
        if (
            response.status === 200 &&
            response.data &&
            response.data.code &&
            response.data.code !== RESPONSE.CODE.SUCCESS
        ) {
            if (response.data.message) {
                message.error(response.data.message)
            }
            if (
                response.data.code === RESPONSE.CODE.NOT_LOGIN &&
                history.navigate &&
                history.location?.pathname !== "/login"
            ) {
                history.navigate("/login")
            }
            Promise.reject(response)
        }
        return response
    },
    function (error) {
        message.error("Network failure")
        return Promise.reject(error)
    }
)
