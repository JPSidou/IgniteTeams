import { Alert, FlatList, TextInput } from "react-native";
import { useState, useEffect, useRef } from "react";

import { ListEmpty } from "@components/ListeEmpty";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import {Filter} from '@components/Filter';
import { PlayerCard } from "@components/PlayerCard";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";
import { Button } from "@components/Button";
import { useRoute, useNavigation } from "@react-navigation/native";
import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroup } from "@storage/player/playersGetByGroup";
import { playerGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { Loading } from "@components/loading";

type RouteParams = {
    group: string;
}

export function Player() {
    const [isLoading, setIsLoading] = useState(true);

    const [newPlayer, setNewPlayer] = useState('');
    const [team, setTeam] = useState('Time A')
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

    const navigation = useNavigation();
    const route = useRoute();
    const { group } = route.params as RouteParams;

    const newPlayerInputRef = useRef<TextInput>(null)
    
    async function handleAddPlayer(){
        if(newPlayer.trim().length === 0){
           return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar');
        };
        const newPlayerList = {
            name: newPlayer,
            team,
        }
        
        try{
            await playerAddByGroup(newPlayerList, group)
            newPlayerInputRef.current?.blur();
            setNewPlayer('');
            fetchPlayersByTeam();
        }catch(error){
            if( error instanceof AppError){
                Alert.alert('Erro ao adicionar pessoa', error.message)
            }else{
                console.log(error)
                Alert.alert('Erro ao adicionar pessoa', 'Ocorreu um erro ao tentar adicionar uma pessoa.')
            }
        }
    }

    async function fetchPlayersByTeam(){
        try{
            setIsLoading(true);
            const playersByTeam = await playerGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);
        }catch(error){
            Alert.alert('Erro ao buscar pessoas', 'Ocorreu um erro ao tentar buscar as pessoas.')
        }finally{
            setIsLoading(false)
        }
    }

    async function handlePlayerRemove(playerName:string){
        try{
            await playerRemoveByGroup(playerName, group);
            fetchPlayersByTeam();
        }catch(error){
            Alert.alert('Erro ao remover pessoa', 'Ocorreu um erro ao tentar remover uma pessoa.')
        }
    }

    async function groupRemove(){
        try{
            await groupRemoveByName(group);
            navigation.navigate('groups');
        }catch(error){
            Alert.alert('Erro ao remover turma', 'Ocorreu um erro ao tentar remover a turma.')
        }
    }

    async function handleGroupRemove(){
        Alert.alert(
            'Remover Turma', 'Tem certeza que deseja remover essa turma?', 
            [
                {text: 'Não', style: 'cancel'},
                {text: 'Sim', onPress: () => groupRemove()}
            ])  
    }

    useEffect(()=>{
        fetchPlayersByTeam();
    }, [team])

    return(
        <Container>
            <Header showBackButton/>
            <Highlight tittle={group} subtittle="adicione a galera e separe os títulos"/>
            <Form>
                <Input 
                inputRef={newPlayerInputRef} 
                onChangeText={setNewPlayer} 
                value={newPlayer} 
                placeholder="Nome da pessoa" 
                autoCorrect={false}
                onSubmitEditing={handleAddPlayer}
                returnKeyType="done"
                />
                <ButtonIcon icon="add" onPress={handleAddPlayer}/>
            </Form>
            <HeaderList>
                <FlatList
                    data={['Time A', 'Time B']}
                    keyExtractor={item => item}
                    renderItem={({item}) => (
                        <Filter 
                            title={item} 
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />
                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>
            </HeaderList>
            {isLoading ? <Loading/> :   
            <FlatList
                data={players}
                keyExtractor={item => item.name}
                renderItem={({item}) => (
                    <PlayerCard name={item.name} onRemove={()=>handlePlayerRemove(item.name)}/>
                )}
                ListEmptyComponent={() => <ListEmpty message='Não há pessoas nesse time.'/>}
                showsVerticalScrollIndicator = {false}
                contentContainerStyle={[
                    {paddingBottom: 80},
                    players.length === 0 && {flex: 1}
                ]}
            /> 
            }
            <Button tittle="Remover Turma" type="SECONDARY"
             onPress={handleGroupRemove}/>
        </Container>
    )
}