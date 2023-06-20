import axios from "axios"
import { Project } from "@/types"

export const addProject = async (
    title: string,
    name: string,
    description: string,
    image: string,
    visible: boolean,
    tags: string[],
    sort: number,
    github: string,
    starCount: number,
    installCount: number,
) => {
    await axios.post("/api/admin/v1/project", {title, name, description, image, visible, tags, sort, github, starCount, installCount})
}

export const listProjects = async () => {
    const response = await axios.get("/api/admin/v1/projects")
    return response.data.data.items as Project[]
}

export const getProject = async (projectId: number) => {
    const response = await axios.get(`/api/admin/v1/project/${projectId}`)
    return response.data.data.project as Project
}

export const deleteProject = async (projectId: number) => {
    await axios.delete(`/api/admin/v1/project/${projectId}`)
}

export const updateProject = async (projectId: number, values: {name?: string, title?: string, description?: string, image?: string, visible?: boolean, tags?: string[], github?: string, starCount?: number, installCount?: number, sort?: number}) => {
    await axios.put(`/api/admin/v1/project/${projectId}`, values)
}