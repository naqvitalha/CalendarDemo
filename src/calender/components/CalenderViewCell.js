import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import CalenderHelper from "../../shared/utils/CalenderHelper";
import Constants from "../constants/Constants";

export default class CalenderViewCell extends Component {
    shouldComponentUpdate(newProps) {
        return this.props.date.getTime() !== newProps.date.getTime() || this.props.events.lastUpdateTimeStamp !== newProps.events.lastUpdateTimeStamp;
    }

    _checkIfCurrentDate() {
        return new Date().getTime() - this.props.date.getTime() < Constants.MILLISECONDS_IN_A_DAY;
    }

    render() {
        const isCurrentDate = this._checkIfCurrentDate();
        const {date, events} = this.props;
        const backgroundStyle = {backgroundColor: date.getMonth() % 2 === 0 ? "white" : "#d3d3d3"};
        return (
            <View style={[backgroundStyle, styles.container]}>
                <Text
                    style={[{opacity: date.getDate() === 1 ? 1 : 0}, styles.monthText]}>{CalenderHelper.getShortMonthName(date)}</Text>
                <Text style={styles.dateText}>{date.getDate()}</Text>
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
        marginTop: 3,
    },
    dateText: {
        fontSize: 14
    }
});
