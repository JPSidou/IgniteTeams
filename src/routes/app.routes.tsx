import { createNativeStackNavigator} from '@react-navigation/native-stack'

import { Groups } from '@screens/Groups';
import { Player } from '@screens/Player';
import { NewGroup } from '@screens/NewGroup';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes(){

    return(
        <Navigator screenOptions={{headerShown: false}}>
            <Screen name='groups' component={Groups}/>
            <Screen name='player' component={Player}/>
            <Screen name='new' component={NewGroup}/>
        </Navigator>
    )
}