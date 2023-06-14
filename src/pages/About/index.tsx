import { Button, Input, Modal } from "antd"
import PageCard from "@/components/PageCard"
import * as api from "@/requests"
import { useLoaderData } from "react-router-dom"
import { ChangeEvent, useState } from "react"
import { css } from "@emotion/css"

export const loader = async () => {
    return `Since high school, I have been actively strengthening my software engineering skills and working to become a better global citizen. My first full stack project of [LatinGuru: Motto](#project-latinguru) offers me a vision where my creativity can prevail and contribute to real world impacts, and I was deeply intrigued.
    As a junior at Carnegie Mellon University, I continue to become a better version of myself, actively involved in projects and research, ranging from web application to natural language processing to robotics.
    In my free time, I am also a national-level golf athlete ⛳️ and a movie lover 🎬.`
}

const Paragraphs = ({ children }: { children?: string }) => {
    const paragraphs = (children ? children : "").split("\n")
    return (
        <>
            {paragraphs.map((paragraph, idx) => {
                const parts: {
                    text: string
                    type?: "anchor" | "url" | "text"
                    target?: string
                }[] = []
                const matches = Array.from(
                    paragraph.matchAll(
                        /(\[([^\]]+)\]\((((http:\/\/)|(https:\/\/)|#)([^)]+))\))/g
                    )
                )
                let index = 0
                for (let match of matches) {
                    parts.push({
                        text: paragraph.substring(index, match.index!),
                        type: "text",
                    })
                    parts.push({
                        text: match[2],
                        target: match[3],
                        type: match[0].startsWith("#") ? "anchor" : "url",
                    })
                    index = match.index! + match[0].length
                }

                if (index < paragraph.length) {
                    parts.push({
                        text: paragraph.substring(index, paragraph.length),
                        type: "text",
                    })
                }
                return (
                    <p key={idx} style={{ marginBottom: "8px" }}>
                        {parts.map((part) => {
                            if (!part.type || part.type === "text") {
                                return part.text
                            }
                            return (
                                <span style={{ fontWeight: 700 }}>
                                    {part.text}
                                </span>
                            )
                        })}
                    </p>
                )
            })}
        </>
    )
}

const About = () => {
    const [about, setAbout] = useState(useLoaderData() as string)

    const [isModalAddTagOpen, setIsModalAddTagOpen] = useState(true)
    const [isModalAddTagConfirmLoading, setIsModalAddTagConfirmLoading] =
        useState(false)

    const [inputAbout, setInputAbout] = useState(about.substring(0))

    const onInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        // TODO 判断markdown

        setInputAbout(e.target.value)
    }

    const onSubmit = () => {
        // TODO request API to update about content

        setAbout(inputAbout)
        setIsModalAddTagOpen(false)
    }

    return (
        <>
            <PageCard
                title="About"
                extra={
                    <Button onClick={() => setIsModalAddTagOpen(true)}>
                        Add New Paragraph
                    </Button>
                }
            >
                <Paragraphs>{about}</Paragraphs>
            </PageCard>

            <Modal
                title="Add Tag"
                open={isModalAddTagOpen}
                onOk={onSubmit}
                onCancel={() => setIsModalAddTagOpen(false)}
                confirmLoading={isModalAddTagConfirmLoading}
            >
                <p
                    className={css`
                        margin-bottom: 5px;
                    `}
                >
                    Input:
                </p>
                <Input.TextArea
                    rows={12}
                    value={inputAbout}
                    onChange={onInputChange}
                />
                <p
                    className={css`
                        margin-top: 15px;
                        margin-bottom: 5px;
                    `}
                >
                    Preview:
                    <Paragraphs>{inputAbout}</Paragraphs>
                </p>
            </Modal>
        </>
    )
}

export const Component = About
export default About
