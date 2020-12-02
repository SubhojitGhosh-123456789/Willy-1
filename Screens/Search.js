import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

export default class Search extends React.Component {
    render(){
        return(
            <View style = {styles.container}>
                <Text>Search Screen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    }
})