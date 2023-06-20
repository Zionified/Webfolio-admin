import type { Tag } from "@/types"
import axios from "axios"

export const addTag = async (tag: string) => {
    await axios.post("/api/admin/v1/tag", {tag})
}

export const deleteTag = async (tag: string) => {
    await axios.delete(`/api/admin/v1/tag/${tag}`)
}

export const renameTag = async (originalTag: string, newTag: string) => {
    await axios.put(`/api/admin/v1/tag/${originalTag}`, {newTag: newTag})
}

export const listTags = async () => {
    const response = await axios.get("/api/admin/v1/tags")
    return response.data.data.items as Tag[]
}

// export const getTag = async (tag: string) => {
//     const response = await axios.get(`/api/admin/v1/tag/${tag}`)
//     return response.data.data.tag as Tag
// }