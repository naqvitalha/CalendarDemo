import React, {Component} from 'react';
import {View, StyleSheet} from "react-native";
import CalenderRoot from "./calender/CalenderRoot";

export default class OutlookRoot extends Component {
    render() {
        return (
            <View style={styles.container}>
                <CalenderRoot/>
            </View>
        );
    }
};
const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        alignItems:'stretch'
    }
});