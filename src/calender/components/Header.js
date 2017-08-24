import React, {Component} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import CalenderHelper from '../../shared/utils/CalenderHelper';
import Constants from '../constants/Constants';

/***
 * Header of the page, simple component that only re-renders if the current selected month or year has changed
 * Shows the day list and month/year on top
 */
export default class Header extends Component {
    constructor(props) {
        super(props);
        this._lastSelectedDate = new Date();
    }

    //Rerender only on month or year change
    shouldComponentUpdate(newProps) {
        const newDate = new Date(newProps.selectedTimeStamp);
        if (this._lastSelectedDate.getMonth() !== newDate.getMonth() || this._lastSelectedDate.getFullYear() !== newDate.getFullYear()) {
            this._lastSelectedDate = newDate;
            return true;
        }
        return false;
    }

    render() {
        const date = this._lastSelectedDate;
        const dateText = CalenderHelper.getMonthName(date) + ', ' + date.getFullYear();
        return (
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <Image style={styles.image} source={require('../../../assets/white_back_arrow.png')} />
                    <Text style={styles.textHeader}>{dateText}</Text>
                </View>
                <View style={styles.textContainer}>
                    {CalenderHelper.getAllDays().map((day, index) => {
                        return <Text style={[styles.textDay, {color: index == 0 || index == 6 ? Constants.LIGHT_GREY : 'white'}]} key={index}>{day[0]}</Text>;
                    })}
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Constants.BLUE_COLOR
    },
    innerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 56
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 19
    },
    image: {
        height: 17,
        width: 17,
        marginLeft: 16,
        marginRight: 16
    },
    textHeader: {
        color: 'white',
        fontSize: 20
    },
    textDay: {
        fontSize: 11,
        flex: 1,
        textAlign: 'center',
        color: 'white',
        fontWeight: '400'
    }
});
