import axios from "axios"
import { Project } from "@/types"

export const addProject = async (
    title: string,
    name: string,
    description: string[],
    image: string,
    visible: boolean,
    tags?: string[],
    starCount?: number,
    installCount?: number
) => {
    await axios.post("/api/v1/project", {title, name, description, image, visible, tags, starCount, installCount})
}

export const listProjects = async () => {
    const response = await axios.get("/api/v1/projects")
    return response.data.data.items as Project[]
}

export const getProject = async (projectId: number) => {
    const response = await axios.get(`/api/v1/project/${projectId}`)
    return response.data.data.project as Project
}

export const deleteProject = async (projectId: number) => {
    await axios.delete(`/api/v1/project/${projectId}`)
}

export const updateProject = async (projectId: number, values: {title: string, description: string[], image: string, visible: boolean, tags?: string[], starCount?: number, installCount?: number}) => {
    await axios.put(`/api/v1/project/${projectId}`, values)
}