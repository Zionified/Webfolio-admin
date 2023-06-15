import { Experience } from "@/types"
import axios from "axios"

export const addExperience = async (company: string, timeline: string, description: string[], visible: boolean, roles: string[], tags: string[]) => {
    return await axios.post("/api/v1/experience", {company, timeline, description, visible, roles, tags})
}

export const listExperiences = async () => {
    const response = await axios.get("/api/v1/experiences")
    return response.data.data.items as Experience[]
}

export const deleteExperience = async (experienceId: number) => {
    await axios.delete(`/api/v1/experience/${experienceId}`)
}

export const updateExperience = async (experienceId: number, values: {company?: string, timeline?: string, description?: string[], visible?: boolean, roles?: string[], tags?: string[]}) => {
    await axios.put(`/api/v1/experience/${experienceId}`, values)
}

export const getExperience = async (experienceId: number) => {
    const response = await axios.get(`/api/v1/experience/${experienceId}`)
    return response.data.data.experience as Experience
}