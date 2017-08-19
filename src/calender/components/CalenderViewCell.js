import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import CalenderHelper from "../../shared/utils/CalenderHelper";
import Constants from "../constants/Constants";

export default class CalenderViewCell extends Component {
    shouldComponentUpdate(newProps) {
        return this.props.date.getTime() !== newProps.date.getTime() || this.props.events.lastUpdateTimeStamp !== newProps.events.lastUpdateTimeStamp;
    }

    _checkIfCurrentDate() {
        const currentTime = new Date().getTime();
        const cellTime = this.props.date.getTime();
        const timeDiff = currentTime - cellTime;
        return timeDiff >= 0 && timeDiff < Constants.MILLISECONDS_IN_A_DAY;
    }

    render() {
        const isCurrentDate = this._checkIfCurrentDate();
        const {date, events} = this.props;
        const backgroundStyle = {backgroundColor: date.getMonth() % 2 === 0 ? "white" : "#d3d3d3"};
        const textStyle = {color: isCurrentDate ? "blue" : "black"}
        return (
            <View style={[backgroundStyle, styles.container]}>
                <Text
                    style={[textStyle, {opacity: date.getDate() === 1 ? 1 : 0}, styles.monthText]}>{CalenderHelper.getShortMonthName(date)}</Text>
                <Text style={[textStyle, styles.dateText]}>{date.getDate()}</Text>
                <View
                    style={[{opacity: events && events.meetings.length > 0 ? 1 : 0}, styles.dot]}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
    },
    dot: {
        borderRadius: 2.5,
        backgroundColor: "blue",
        width: 5,
        height: 5,
        marginTop: 4,
        marginBottom: 3
    },
    monthText: {
        fontSize: 10,
        marginTop: 5,
    },
    dateText: {
        fontSize: 14
    }
});
