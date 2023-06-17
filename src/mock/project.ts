import { Project } from "@/types"
import mock from "./mock"
import { RESPONSE } from "@/consts"
import { ProjectFilled } from "@ant-design/icons"

let PROJECT = [
    {
        id: 1,
        sort: 1,
        title: "Portfolio Nexus: Web Portfolio and Administration Hub",
        name: "portfolio",
        description: [
            "Developed and deployed a well-functional single page web portfolio application using React (TypeScript) and an admin site using Ant Design with integrated Markdown editor to manage dynamic web page data",
            "Incorporated responsive design, CSS animation, dynamic theme, and a rolling bullet curtain feature for skills in portfolio page",
            "Designed a well-structured database schema utilizing Python-based ORM library SQLAlchemy to ensure efficient data storage and management",
            "Implemented the backend functionality using FastAPI framework to enable smooth data retrieval, manipulation, and secure authentication; utilized Axios for seamless communication with the backend API",
        ],
        image: "https://pbs.twimg.com/profile_images/446356636710363136/OYIaJ1KK_400x400.png",
        tags: [
            "Typescript",
            "React",
            "SQLAlchemy",
            "Python",
            "FastAPI",
            "Responsive Web Design",
        ],
        starCount: 100,
        visible: true,
    },
    {
        id: 2,
        sort: 2,
        title: "COMPASS (COntext Marking and starter PhrAses for Synchronized Socializing)",
        name: "compass",
        description: [
            "Collaborated in the implementation of a web-based interface designed to facilitate real-time online communication for users with speech-generating disabilities",
            "Performed text cleaning and stop words removal on 3940 dialogue scripts from switchboard dialogue act corpus using Python",
            "Refined keyword extraction model KeyBERT and evaluated its performance on the switchboard dataset using cosine word embedding similarity; achieved 78% average accuracy in extracting conversation topics",
            "Developed visualization pipelines in R for analyzing user satisfaction, interface usability, and feature effectiveness based on the results of the user study on 6 pairs",
        ],
        image: "https://lti.cs.cmu.edu/sites/all/themes/lti2015/images/collaborate.png",
        tags: ["Python", "KeyBERT", "R", "Data Visualization"],
        installCount: 100000,
        visible: false,
    },
    {
        id: 3,
        sort: 3,
        title: "LatinGuru: Motto - Online Interactive Latin Motto APP",
        name: "latinguru",
        description: [
            "Web-crawled 572 + school mottos and Latin-word dictionaries using Python and stored data in MySQL",
            "Built a mobile application with Django as the backend to support data categorization and transmission; manually edited English and Chinese translations and composed grammar references on the Django admin site",
            "Designed and implemented UI that supports Motto Search, Latin English/Mandarin Dictionary, Favorites, and Grammar using Vue.js to elevate Latin's accessibility for beginners and promoted interactive Latin learning",
            "Launched the App on Google Play and received Authorship of Software Issued by the National Patent Bureau",
        ],
        image: "https://super.abril.com.br/wp-content/uploads/2018/07/531e320b9827682eba0002bfmundoestranho-147-55-ed-1.jpeg",
        tags: ["Python", "Web Crawler", "MySQL", "Django", "Vue"],
        installCount: 10000,
        starCount: 499,
        visible: false,
    },
    {
        id: 4,
        sort: 4,
        title: "Dynamic Memory Allocator",
        name: "malloc",
        description: [
            "Constructed a 64-bit struct-based dynamic memory allocator that supports malloc, calloc, realloc, and free functions in C",
            "Boosted space efficiency by reducing internal and external fragmentations through footer elimination, mini-block implementation, and better-fit searching algorithm",
            "Optimized throughput from 100 Kops/s to 16,000 Kops/s using the segregated free list and LIFO insertion policy",
        ],
        image: "https://cdn-icons-png.flaticon.com/512/2630/2630878.png",
        visible: false,
    },
]

mock.onPost("/api/v1/project").reply((config) => {
    const data = JSON.parse(config.data)
    const maxId = PROJECT.map((proj) => proj.id).reduce(
        (prev, curr) => (prev > curr ? prev : curr),
        0
    )
    let newProject = {
        id: maxId + 1,
        sort: maxId + 1,
        title: data.title,
        name: data.name,
        description: data.description,
        image: data.image,
        tags: data.tags,
        installCount: data.installCount,
        starCount: data.starCount,
        visible: data.visible,
    }
    newProject = Object.fromEntries(
        Object.entries(newProject).filter(
            ([_, value]) => value !== undefined && value !== null
        )
    ) as typeof newProject
    // console.log(newProject)
    PROJECT.push(newProject)
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
        },
    ]
})

mock.onGet("/api/v1/projects").reply((config) => {
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
            data: {
                items: PROJECT,
            },
        },
    ]
})

mock.onGet(new RegExp("/api/v1/project/(.+)")).reply((config) => {
    const projectId = new RegExp("/api/v1/project/(.+)").exec(config.url!)![1]
    const filteredProjects = PROJECT.filter(
        (proj) => proj.id.toString() === projectId
    )
    if (filteredProjects.length === 0) {
        return [
            200,
            {
                code: "005001",
                message: "project not found",
            },
        ]
    }
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
            data: {
                project: filteredProjects[0],
            },
        },
    ]
})

mock.onDelete(new RegExp("/api/v1/project/(.+)")).reply((config) => {
    const projectId = new RegExp("/api/v1/project/(.+)").exec(config.url!)![1]
    PROJECT = PROJECT.filter((proj) => proj.id.toString() !== projectId)
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
        },
    ]
})

mock.onPut(new RegExp("/api/v1/project/(.+)")).reply((config) => {
    const projectId = new RegExp("/api/v1/project/(.+)").exec(config.url!)![1]
    const filteredProjects = PROJECT.filter(
        (proj) => proj.id.toString() === projectId
    )
    const data = JSON.parse(config.data)
    if (filteredProjects.length === 0) {
        return [
            200,
            {
                code: "005002",
                message: "project not found",
            },
        ]
    }
    PROJECT = PROJECT.map((project) =>
        project.id.toString() === projectId
            ? { ...filteredProjects[0], ...data }
            : project
    )
    return [
        200,
        {
            code: RESPONSE.CODE.SUCCESS,
        }
    ]
})
