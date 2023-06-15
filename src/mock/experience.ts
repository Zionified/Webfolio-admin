import { Experience } from "@/types"
import mock from "./mock"
import { RESPONSE } from "@/consts"

let EXPERIENCES: Experience[] = [
    {
        id: 1,
        sort: 1,
        timeline: "May 2023-Present",
        roles: [
            "Research Assistant",
            "Summer Undergraduate Research Apprenticeship",
        ],
        company: "Robotics Institute at CMU",
        description: [
            "Engineer a novel approach to incorporate physics constraints with computer vision algorithm NeRF (Neural Radiance Fields) to accurately predict the state of cloth-like objects under manipulation in biomedical applications",
            "Design and implement script using Blender Python API to automatically generate 120+ simulation scenes in Blender for algorithm evaluation; incorporated randomized cloth size, texture, falling heights, and ground objects",
            "Combine Real-Time High-Resolution Background Matting model with COLMAP pipeline using Python to generate synthetic image dataset with subtracted background and JSON file of camera Field of Views (FOV) and relative poses",
            "Leverage AprilTag to recover objects' world frame translation and scale to improve robots' perception capabilities",
        ],
        tags: ["NeRF", "Blender", "COLMAP ", "Python", "AprilTag"],
        visible: true,
    },
    {
        id: 2,
        sort: 2,
        timeline: "June 2019-March 2021",
        roles: ["Research Assistant"],
        company: "Guangzhou Intelligence Electrical Technology Company, Ltd. ",
        description: [
            "Used LabelImg to manually label and classify 1271 sample bird nest images taken by drones as training and testing dataset",
            "Augmented data through mirroring, rotation, Gaussian blur, pixel removal using PyTorch, resized images, and labeled regions",
            "Evaluated model's performance using Mean Average Precision (MAP), successfully raising 10+% accuracy rate and boosting 80 % processing efficiency",
            "Published 10+ pages report in IEEE Access Journal (Volume: 7); granted National Patent for Technological Invention	",
        ],
        tags: ["LabelImg", "PyTorch", "Python", "Data Processing"],
        visible: false,
    },
]

mock.onPost("/api/v1/experience").reply((config) => {
    const data = JSON.parse(config.data)
    const maxId = EXPERIENCES.map((experience) => experience.id).reduce(
        (prevId, currId) => (prevId > currId ? prevId : currId),
        0
    )
    const newExperience = {
        id: maxId + 1,
        sort: maxId + 1,
        timeline: data.timeline,
        roles: data.roles,
        company: data.company,
        description: data.description,
        tags: data.tags,
        visible: data.visible,
    }
    EXPERIENCES.push(newExperience)

    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
        },
    ]
})

mock.onGet("/api/v1/experiences").reply((config) => {
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
            data: {
                items: EXPERIENCES,
            },
        },
    ]
})

mock.onGet(new RegExp("/api/v1/experience/(.+)")).reply((config) => {
    const experienceId = new RegExp("/api/v1/experience/(.+)").exec(
        config.url!
    )![1]
    const filteredExperiences = EXPERIENCES.filter(
        (experience) => experience.id.toString() === experienceId
    )
    if (filteredExperiences.length === 0) {
        return [
            200,
            {
                code: "004001",
                message: "experience not found",
            },
        ]
    }
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
            data: {
                experience: filteredExperiences[0],
            },
        },
    ]
})

mock.onDelete(new RegExp("/api/v1/experience/(.+)")).reply((config) => {
    const experienceId = new RegExp("/api/v1/experience/(.+)").exec(
        config.url!
    )![1]
    EXPERIENCES = EXPERIENCES.filter(
        (experience) => experience.id.toString() !== experienceId
    )
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
        },
    ]
})

mock.onPut(new RegExp("/api/v1/experience/(.+)")).reply((config) => {
    const data = JSON.parse(config.data)
    const experienceId = new RegExp("/api/v1/experience/(.+)").exec(
        config.url!
    )![1]
    const filteredExperiences = EXPERIENCES.filter(
        (experience) => experience.id.toString() === experienceId
    )
    if (filteredExperiences.length === 0) {
        return [
            200,
            {
                code: "004002",
                message: "experience not found",
            },
        ]
    }
    EXPERIENCES = EXPERIENCES.map((experience) =>
        experience.id.toString() === experienceId
            ? { ...filteredExperiences[0], ...data }
            : experience
    )
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
        },
    ]
})
