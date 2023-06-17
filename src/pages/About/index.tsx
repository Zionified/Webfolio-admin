import PageCard from "@/components/PageCard"
import { css } from "@emotion/css"
import { Button, Form, Input, Modal } from "antd"
import { useState } from "react"
import { useLoaderData } from "react-router-dom"
import * as api from "@/requests"

export const loader = async () => {
    return await api.listAbout()
}

type Props = {
    children?: string
}

const Paragraphs = ({ children }: Props) => {
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
                    // console.log(match)
                    parts.push({
                        text: paragraph.substring(index, match.index!),
                        type: "text",
                    })
                    parts.push({
                        text: match[2],
                        target: match[3],
                        type: match[3].startsWith("#") ? "anchor" : "url",
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
                    <p key={idx}>
                        {parts.map((part, idx) => {
                            if (!part.type || part.type === "text") {
                                return part.text
                            }
                            return (
                                <span style={{ fontWeight: 700 }} key={idx}>
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

    const [isModalEditParagraphsOpen, setIsModalEditParagraphsOpen] =
        useState(false)
    const [
        isModalEditParagraphsConfirmLoading,
        setIsModalEditParagraphsConfirmLoading,
    ] = useState(false)

    const [inputAbout, setInputAbout] = useState(about)

    const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputAbout(e.target.value)
    }

    const refreshAbout = async () => {
        setAbout(await api.listAbout())
    }
    const onSubmit = async () => {
        try {
            setIsModalEditParagraphsConfirmLoading(true)
            await api.updateAbout(inputAbout)
            refreshAbout()
            setIsModalEditParagraphsOpen(false)
        } catch (err) {
        } finally {
            setIsModalEditParagraphsConfirmLoading(false)
        }
    }

    return (
        <>
            <PageCard
                title="About"
                extra={
                    <Button onClick={() => setIsModalEditParagraphsOpen(true)}>
                        Edit Paragraphs
                    </Button>
                }
            >
                <Paragraphs>{about}</Paragraphs>
            </PageCard>
            <Modal
                title="Edit Paragraphs"
                open={isModalEditParagraphsOpen}
                onOk={onSubmit}
                onCancel={() => setIsModalEditParagraphsOpen(false)}
                confirmLoading={isModalEditParagraphsConfirmLoading}
            >
                <p
                    className={css`
                        margin-bottom: 10px;
                        font-weight: 600;
                    `}
                >
                    Input:
                </p>
                <Input.TextArea
                    rows={12}
                    value={inputAbout}
                    onChange={onInputChange}
                />
                <div
                    className={css`
                        margin-top: 10px;
                    `}
                >
                    Preview:
                    <Paragraphs>{inputAbout}</Paragraphs>
                </div>
            </Modal>
        </>
    )
}

export const Component = About
export default About
