import axios from "axios"

export const updateAbout = async (about: string) => {
    await axios.put("/api/v1/about", { about })
}

export const listAbout = async () => {
    const response = await axios.get("/api/v1/about")
    return response.data.data.items as string
}
