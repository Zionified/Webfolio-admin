export type Article = {
    id: number;
    title: string;
    markdown: string;
    createTime: string;
    tags: string[];
    visible: boolean;
}