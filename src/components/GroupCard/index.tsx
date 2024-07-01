import { Container, Tittle, Icon } from "./styles";
import { TouchableOpacityProps } from "react-native";
type Props = TouchableOpacityProps & {
    tittle: string;
}

export function GroupCard({ tittle, ...rest }: Props){
    return(
        <Container {...rest}>
            <Icon />
            <Tittle>{tittle}</Tittle>
        </Container>
    )
}