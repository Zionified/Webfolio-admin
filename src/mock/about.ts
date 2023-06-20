import mock from "./mock"
import { RESPONSE } from "@/consts"

let ABOUT: string = `Since high school, I have been actively strengthening my software engineering skills and working to become a better global citizen. My first full stack project of [LatinGuru: Motto](#project-latinguru) offers me a vision where my creativity can prevail and contribute to real world impacts, and I was deeply intrigued.
As a junior at Carnegie Mellon University, I continue to become a better version of myself, actively involved in projects and research, ranging from web application to natural language processing to robotics.
In my free time, I am also a national-level golf athlete ⛳️ and a movie lover 🎬.`

mock.onPut("/api/admin/v1/about").reply((config) => {
    const data = JSON.parse(config.data)
    ABOUT = data.about
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
        },
    ]
})

mock.onGet("/api/admin/v1/about").reply((config) => {
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
            data: {
                items: ABOUT,
            },
        },
    ]
})
