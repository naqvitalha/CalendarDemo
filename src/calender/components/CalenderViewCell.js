import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import CalenderHelper from '../../shared/utils/CalenderHelper';
import Constants from '../constants/Constants';

export default class CalenderViewCell extends Component {
    shouldComponentUpdate(newProps) {
        return (
            this.props.date.getMonth() !== newProps.date.getMonth() ||
            this._hasEvents(this.props.events) !== this._hasEvents(newProps.events) ||
            this._isSelected(this.props) !== this._isSelected(newProps)
        );
    }

    _hasEvents(events) {
        return events && events.meetings.length > 0;
    }

    _isSelected(props) {
        return props.selectedTimeStamp === props.date.getTime();
    }

    _checkIfCurrentDate() {
        const currentTime = new Date().getTime();
        const cellTime = this.props.date.getTime();
        const timeDiff = currentTime - cellTime;
        return timeDiff >= 0 && timeDiff < Constants.MILLISECONDS_IN_A_DAY;
    }

    _handleOnPress = () => {
        this.props.actions.updateSelectedDate(this.props.date, this.props.currentIndex, 'CALENDER_VIEW');
    };

    render() {
        const isCurrentDate = this._checkIfCurrentDate();
        const {date, events} = this.props;
        const isSelectedDate = this._isSelected(this.props);
        const backgroundStyle = {backgroundColor: date.getMonth() % 2 === 0 ? 'white' : Constants.VERY_LIGH_GREY};
        const textStyle = isSelectedDate ? {color: 'white'} : {color: isCurrentDate ? Constants.BLUE_COLOR : 'black'};
        let monthText = 'NA', monthOpacity = 0;
        if (!isSelectedDate && date.getDate() === 1) {
            monthOpacity = 1;
            monthText = CalenderHelper.getShortMonthName(date);
        }
        return (
            <TouchableWithoutFeedback onPress={this._handleOnPress} style={{flex: 1}}>
                <View style={[backgroundStyle, styles.container]}>
                    {isSelectedDate
                        ? <View style={styles.circleContainer}>
                              <View style={styles.circle} />
                          </View>
                        : null}
                    <Text style={[textStyle, {opacity: monthOpacity}, styles.monthText]}>{monthText}</Text>
                    <Text style={[textStyle, styles.dateText]}>{date.getDate()}</Text>
                    <View style={[{opacity: !isSelectedDate && this._hasEvents(events) ? 1 : 0}, styles.dot]} />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1
    },
    dot: {
        borderRadius: 2.5,
        backgroundColor: Constants.BLUE_COLOR,
        width: 5,
        height: 5,
        marginTop: 4,
        marginBottom: 4
    },
    monthText: {
        fontSize: 8,
        marginTop: 5
    },
    dateText: {
        fontSize: 14,
        backgroundColor: 'transparent',
        marginTop: -3
    },
    circleContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    circle: {
        height: Constants.CELL_SIDE_LENGTH - 16,
        width: Constants.CELL_SIDE_LENGTH - 16,
        borderRadius: (Constants.CELL_SIDE_LENGTH - 16) / 2,
        backgroundColor: Constants.BLUE_COLOR
    }
});
