import axios from "axios"

export const getMapping = async (key: string) => {
    const response = await axios.get("/api/admin/v1/mappings", {
        params: { keys: JSON.stringify([key]) },
    })
    return response.data.data[key] as string
}

export const updateMapping = async (key: string, value: string) => {
    await axios.put(`/api/admin/v1/mapping/${key}`, {value})
}
