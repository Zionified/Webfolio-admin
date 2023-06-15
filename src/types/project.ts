export type Project = {
    id: number,
    sort: number,
    title: string,
    name: string,
    description: string[],
    image: string,
    visible: boolean,
    tags?: string[],
    starCount?: number,
    installCount?: number,
}