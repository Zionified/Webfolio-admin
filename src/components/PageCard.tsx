import styled from "@emotion/styled"
import { Card } from "antd"
import { ReactNode } from "react"

type Props = {
    title: string,
    extra?: ReactNode,
    children?: ReactNode,
    bordered?: boolean,
}

const StyledCard = styled(Card)`
    box-shadow: none !important;
`
const PageCard = ({title, extra, children, bordered}: Props) => {
    bordered = bordered ? bordered : false
    return (
        <StyledCard title={title} bordered={bordered} extra={extra}>
            {children}
        </StyledCard>
    )
}

export default PageCard