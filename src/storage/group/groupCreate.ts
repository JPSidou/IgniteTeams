import AsyncStorage from "@react-native-async-storage/async-storage";
import { GROUP_COLLECTION } from "@storage/storageConfig";
import { groupsGetAll } from "./groupsGetAll";
import { AppError } from "@utils/AppError";

export async function groupCreate(newGroup: string){
    try{
        const storagedGroups = await groupsGetAll();

        const groypAlreadyExists = storagedGroups.includes(newGroup);

        if(groypAlreadyExists){
            throw new AppError('Grupo já existe!')
        }

        const storage = JSON.stringify([...storagedGroups, newGroup])

        await AsyncStorage.setItem(GROUP_COLLECTION, storage);

    }catch(error){
        throw error;
    }
}