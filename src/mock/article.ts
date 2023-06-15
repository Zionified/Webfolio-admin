import { Article } from "@/types"
import mock from "./mock"
import {RESPONSE} from "@/consts"

let ARTICLES: Article[] = [
    {
        id: 1,
        title: "Using the Effect Hook",
        markdown: "### Header1 ###",
        createTime: "2023-06-11T22:19:00",
        tags: ["TypeScript", "React"],
        visible: true,
    },
    {
        id: 2,
        title: "Effects Without Cleanup",
        markdown: "** Emphasized Items **",
        createTime: "2023-06-11T22:19:00",
        tags: ["TypeScript", "React"],
        visible: false,
    },
]

mock.onPost("/api/v1/article").reply((config) => {
    const data = JSON.parse(config.data)
    const id = ARTICLES.map((article) => article.id).reduce((prev, curr) => (prev > curr ? prev : curr), 0)
    const addArticle = {
        id: id+1,
        title: data.title,
        markdown: data.markdown,
        createTime: "2023-06-11T22:19:00",
        tags: data.tags,
        visible: data.visible,
    }

    ARTICLES.push(addArticle)

    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
        }
    ]
})

mock.onGet("/api/v1/articles").reply(() => {
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
            data: {
                items: ARTICLES,
            }
        }
    ]
})

mock.onGet(new RegExp("/api/v1/article/(.+)")).reply((config) => {
    const articleId = new RegExp("/api/v1/article/(.+)").exec(config.url!)![1]
    const filteredArticles = ARTICLES.filter((article) => article.id.toString() === articleId)
    if (filteredArticles.length === 0) {
        return [
            200,
            {
                code: "003001",
                message: "article not exist",
            }
        ]
    }

    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
            data: {
                article: filteredArticles[0],
            }
        }
    ]
})

mock.onPut(new RegExp("/api/v1/article/(.+)")).reply((config) => {
    const articleId = new RegExp("/api/v1/article/(.+)").exec(config.url!)![1]
    const filteredArticles = ARTICLES.filter((article) => article.id.toString() === articleId)
    if (filteredArticles.length === 0) {
        return [
            200,
            {
                code: "003001",
                message: "article not exist",
            }
        ]
    }

    const data = Object.fromEntries(Object.entries(JSON.parse(config.data)).filter(([_, value]) => value !== undefined))
    ARTICLES = ARTICLES.map((article) => article.id.toString() === articleId ? {...filteredArticles[0], ...data} : article)
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
        }
    ]
})
mock.onDelete(new RegExp("/api/v1/article/(.+)")).reply((config) => {
    const articleId = new RegExp("/api/v1/article/(.+)").exec(config.url!)![1]
    ARTICLES = ARTICLES.filter((article) => article.id.toString() !== articleId)
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
        }
    ]
})

