import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

export default class BookTransaction extends React.Component {
    render(){
        return(
            <View style = {styles.container}>
                <Text>Book Transaction Screen</Text>
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