import { useState, useCallback } from 'react';
import { Alert, FlatList } from 'react-native';
import { Container } from './styles';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { ListEmpty } from '@components/ListeEmpty';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Button } from '@components/Button';
import { groupsGetAll } from '@storage/group/groupsGetAll';
import { Loading } from '@components/loading';

export  function Groups() {
  const [isLoading, setIsLoading] = useState(true);

  const [groups, setGroups] = useState([]);
  
  const navigation = useNavigation();

  function handleNewGroup(){
    navigation.navigate('new');
  }

  async function fetchGroups(){
    try{
      setIsLoading(true);
      const data = await groupsGetAll();
      setGroups(data);
    }catch(error){
      Alert.alert('Erro ao buscar turmas', 'Ocorreu um erro ao tentar buscar as turmas.')
    }finally{
      setIsLoading(false);
    }
  }

  function handleOpenGroup(group: string){
    navigation.navigate('player', {group})
  }

  useFocusEffect(useCallback(()=>{
    fetchGroups();
  }, []));

  return (
    <Container>
      <Header/>
      <Highlight tittle='Turmas' subtittle='jogue com a sua turma'/>
      {isLoading ? <Loading/> : 
        <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({item}) => (
        <GroupCard 
        tittle={item}
        onPress={() => handleOpenGroup(item)}
        />
        )}
        contentContainerStyle={groups.length == 0 && { flex: 1 }}
        ListEmptyComponent={() => <ListEmpty message='Adicione sua primeira turma!'/>}
        showsVerticalScrollIndicator= {false}
        />
       }
      <Button tittle='Criar nova turma' onPress={handleNewGroup}/>
    </Container>
  );
}

