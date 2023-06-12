import type { Tag } from "@/types"
import axios from "axios"

export const addTag = async (tag: string) => {
    await axios.post("/api/v1/tag", {tag})
}

export const deleteTag = async (tag: string) => {
    await axios.delete(`/api/v1/tag/${tag}`)
}

export const renameTag = async (originalTag: string, newTag: string) => {
    await axios.put(`/api/v1/tag/${originalTag}`, {tag: newTag})
}

export const listTags = async () => {
    const response = await axios.get("/api/v1/tags")
    return response.data.data.items as Tag[]
}

// export const getTag = async (tag: string) => {
//     const response = await axios.get(`/api/v1/tag/${tag}`)
//     return response.data.data.tag as Tag
// }