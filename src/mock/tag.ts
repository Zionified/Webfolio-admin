import { Tag } from "@/types"
import mock from "./mock"
import {RESPONSE} from "@/consts"

let TAGS: Tag[] = [
    {
        tag: "Python",
        createTime: "2023-06-11T22:19:00",
    },
    {
        tag: "Java",
        createTime: "2023-06-11T22:19:00",
    },
    {
        tag: "TypeScript",
        createTime: "2023-06-11T22:19:00",
    },
]

mock.onPost("/api/v1/tag").reply((config) => {
    const configTag = JSON.parse(config.data)['tag']
    const filteredTags = TAGS.filter((tag) => tag.tag === configTag)
    if (filteredTags.length !== 0) {
        return [
            200,
            {
                code: "002001",
                message: "duplicate tag",
            },
        ]
    }

    const addedTag = {
        tag: configTag,
        createTime: "2023-06-11T22:19:00",
    }

    TAGS.push(addedTag)

    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS
        }
    ]
})

mock.onGet("/api/v1/tags").reply(() => {
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
            data: {
                items: TAGS
                // 为了后面方便加入pagination的limit，offset等
            }
        }
    ]
})

mock.onDelete(new RegExp("/api/v1/tag/(.+)")).reply((config) => {
    const deleteTag = new RegExp("/api/v1/tag/(.+)").exec(config.url!)![1]
    TAGS = TAGS.filter((tag) => tag.tag !== deleteTag)
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS
        }
    ]
})

mock.onPut(new RegExp("/api/v1/tag/(.+)")).reply((config) => {
    const renameTag = new RegExp("/api/v1/tag/(.+)").exec(config.url!)![1]
    console.log(config.url)
    const filteredTags = TAGS.filter((tag) => tag.tag === renameTag)
    if (filteredTags.length === 0) {
        return [
            200,
            {
                code: "002001",
                message: "tag not exist",
            },
        ]
    }

    filteredTags[0].tag = JSON.parse(config.data)['tag']

    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS
        }
    ]
})