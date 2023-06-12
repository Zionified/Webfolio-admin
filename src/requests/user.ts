import { RESPONSE, TOKEN_KEY } from "@/consts"
import type { User } from "@/types"
import axios from "axios"

export const login = async (username: string, password: string) => {
    // {usrname, pwd} is config in requests
    const response = await axios.post("/api/v1/user/login", {
        username,
        password,
    })
    if (response.data.code !== RESPONSE.CODE.SUCCESS) {
        throw response
    }
    if (response.data.data && response.data.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.data.token)
    }
    return
}

export const fetchLoginUser = async () => {
    const response = await axios.get("/api/v1/loginUser")
    if (response.data.code !== RESPONSE.CODE.SUCCESS) {
        throw response
    }
    return response.data.data as User
}

export const logout = async () => {
    localStorage.removeItem(TOKEN_KEY)
}

export const updateUserInfo = async (nickname: string) => {
    const response = await axios.put("/api/v1/loginUser", {nickname})
    if (response.data.code !== RESPONSE.CODE.SUCCESS) {
        throw response
    }
    return response.data.data as User
}

export const updateUserPassword = async (newPassword: string) => {
    const response = await axios.patch("/api/v1/loginUser/password", {newPassword})
    if (response.data.code !== RESPONSE.CODE.SUCCESS) {
        throw response
    }
    return response.data.data as User
}