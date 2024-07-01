import { TouchableOpacityProps } from "react-native";
import { Container, Tittle, ButtonTypeStyleProps } from "./styles";

type Props = TouchableOpacityProps & {
    tittle: string;
    type?: ButtonTypeStyleProps;	
}

export function Button({tittle, type = 'PRIMARY', ...rest}: Props){
    return (
        <Container type={type} {...rest}>
            <Tittle>{tittle}</Tittle>
        </Container>
    )
}