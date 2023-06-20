import { Experience } from "@/types"
import axios from "axios"

export const addExperience = async (name: string, timeline: string, roles: string[], company: string, description: string, tags: string[], visible: boolean, sort: number) => {
    return await axios.post("/api/admin/v1/experience", {name, timeline, roles, company, description, tags, visible, sort})
}

export const listExperiences = async () => {
    const response = await axios.get("/api/admin/v1/experiences")
    return response.data.data.items as Experience[]
}

export const deleteExperience = async (experienceId: number) => {
    await axios.delete(`/api/admin/v1/experience/${experienceId}`)
}

export const updateExperience = async (experienceId: number, values: {name?: string, company?: string, timeline?: string, description?: string, visible?: boolean, roles?: string[], tags?: string[], sort: number}) => {
    await axios.put(`/api/admin/v1/experience/${experienceId}`, values)
}

export const getExperience = async (experienceId: number) => {
    const response = await axios.get(`/api/admin/v1/experience/${experienceId}`)
    return response.data.data.experience as Experience
}