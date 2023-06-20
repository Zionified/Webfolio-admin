import axios from "axios"
import { RESPONSE, TOKEN_KEY } from "./consts"
import message from "antd/es/message"
import history from "./history"

// Add a request interceptor
axios.interceptors.request.use(
    function (config) {
        if (localStorage.getItem(TOKEN_KEY)) {
            config.headers["Token"] = localStorage.getItem(TOKEN_KEY)
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
        // console.log("response interceptor: ", response)
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
            return Promise.reject(response)
        }
        return response
    },
    function (error) {
        message.error("Network failure")
        return Promise.reject(error)
    }
)
