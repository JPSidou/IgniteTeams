import { Container, Tittle, SubTittle } from "./styles";

type Props={
    tittle: string;
    subtittle: string;
}

export function Highlight({tittle, subtittle}: Props) {
    return(
        <Container>
            <Tittle>{tittle}</Tittle>
            <SubTittle>{subtittle}</SubTittle>
        </Container>
    )
}