import React, {Component} from 'react';
import {Text, View, StyleSheet, Image} from "react-native";
import CalenderHelper from "../../shared/utils/CalenderHelper";

export default class Header extends Component {
    shouldComponentUpdate(newProps){
        return this.props.selectedTimeStamp !== newProps.selectedTimeStamp;
    }
    render() {
        const date = new Date(this.props.selectedTimeStamp);
        const dateText = CalenderHelper.getMonthName(date) + ", " + date.getFullYear();
        return (
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <Image style={styles.image} source={require("../../../assets/white_back_arrow.png")}/>
                    <Text style={styles.textHeader}>{dateText}</Text>
                </View>
                <View style={styles.textContainer}>
                    {CalenderHelper.getAllDays().map((day, index) => {
                        return <Text style={styles.textDay} key = {index}>{day[0]}</Text>
                    })}
                </View>
            </View>);
    }
}
const styles = StyleSheet.create({
    container: {

    },
    innerContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        height: 56,
        backgroundColor: "blue",
    },
    textContainer:{
        flexDirection: "row",
        justifyContent:"space-around"
    },
    image: {
        height: 17,
        width: 17,
        marginLeft: 16,
        marginRight: 16
    },
    textHeader: {
        color: "white",
        fontSize: 20
    },
    textDay:{
        fontSize:14,
        flex: 1,
        textAlign:"center"
    }
});