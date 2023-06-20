import mock from "./mock"
import {RESPONSE} from "@/consts"

const USERS = [
    {
        id: 1,
        username: "zixuan",
        password: "1234",
        nickname: "z",
        avatar: "https://lumiere-a.akamaihd.net/v1/images/a_avatarpandorapedia_neytiri_16x9_1098_01_0e7d844a.jpeg?region=240%2C0%2C1440%2C1080",
    },
    {
        id: 2,
        username: "john",
        password: "123456",
        nickname: "j",
        avatar: "https://lumiere-a.akamaihd.net/v1/images/a_avatarpandorapedia_neytiri_16x9_1098_01_0e7d844a.jpeg?region=240%2C0%2C1440%2C1080",
    
    },
]

mock.onPost("/api/admin/v1/user/login").reply((config) => {
    const data = JSON.parse(config.data)
    const filteredUsers = USERS.filter((user) => {
        return (
            user.username === data.username && user.password === data.password
        )
    })
    if (filteredUsers.length === 0) {
        return [
            200,
            {
                code: "001002",
                message: "user does not exist or wrong password",
            },
        ]
    }

    localStorage.setItem(
        "__MOCK_LOGIN_USERID__",
        filteredUsers[0].id.toString()
    )
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
            data: {
                token: "",
            },
        },
    ]
})

mock.onGet("/api/admin/v1/loginUser").reply((config) => {
    const loginUserId = localStorage.getItem("__MOCK_LOGIN_USERID__")
    const filteredUsers = USERS.filter((user) => user.id.toString() === loginUserId)
    if (filteredUsers.length === 0) {
        return [
            200,
            {
                code: RESPONSE.CODE.NOT_LOGIN, 
                message: "log in first"
            }
        ]
    }
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
            data: {
                id: filteredUsers[0].id,
                username: filteredUsers[0].username,
                nickname: filteredUsers[0].nickname,
                avatar: filteredUsers[0].avatar,
            }
        }
    ]
})

mock.onPut("/api/admin/v1/loginUser").reply((config) => {
    const loginUserId = localStorage.getItem("__MOCK_LOGIN_USERID__")
    const filteredUsers = USERS.filter((user) => user.id.toString() === loginUserId)
    if (filteredUsers.length === 0) {
        return [
            200,
            {
                code: RESPONSE.CODE.NOT_LOGIN, 
                message: "log in first"
            }
        ]
    }
    filteredUsers[0].nickname = JSON.parse(config.data).nickname
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
        }
    ]
})

mock.onPatch("/api/admin/v1/loginUser/password").reply((config) => {
    const loginUserId = localStorage.getItem("__MOCK_LOGIN_USERID__")
    const filteredUsers = USERS.filter((user) => user.id.toString() === loginUserId)
    if (filteredUsers.length === 0) {
        return [
            200,
            {
                code: RESPONSE.CODE.NOT_LOGIN, 
                message: "log in first"
            }
        ]
    }
    filteredUsers[0].password = JSON.parse(config.data).newPassword
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
        }
    ]
})
