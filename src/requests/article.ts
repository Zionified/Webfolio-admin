import { Article } from "@/types"
import axios from "axios"

export const addArticle = async ({title, tags, markdown, visible}: {title: string, tags: string[], markdown: string, visible: boolean}) => {
    await axios.post("/api/admin/v1/article", {title, tags, markdown, visible})
}

export const listArticles = async () => {
    const response = await axios.get("/api/admin/v1/articles")
    return response.data.data.items as Article[]
}

export const deleteArticle = async (articleId: number) => {
    await axios.delete(`/api/admin/v1/article/${articleId}`)
}

export const updateArticle = async (articleId: number, values: {title?: string, markdown?: string, tags?: string[], visible?: boolean}) => {
    await axios.put(`/api/admin/v1/article/${articleId}`, values)
}

export const getArticle = async (articleId: number) => {
    const response = await axios.get(`/api/admin/v1/article/${articleId}`)
    return response.data.data.article as Article
}

