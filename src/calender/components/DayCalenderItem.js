import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text, View, StyleSheet} from 'react-native';
import CalenderHelper from '../../shared/utils/CalenderHelper';
import EventRow from "./EventRow";

export default class DayCalenderItem extends Component {
    static propTypes = {
        date: PropTypes.instanceOf(Date),
        events: PropTypes.object
    };
    static defaultProps = {
    }

    render() {
        const {date, events} = this.props;
        const headerText = CalenderHelper.getDayName(date) + ', ' + CalenderHelper.getMonthName(date) + ' ' + date.getDate();
        return (
            <View style={styles.container}>
                <View style={styles.separatorLine}/>
                <Text style={styles.headerText}>{headerText}</Text>
                <View style={styles.separatorLine}/>
                {events && events.meetings && events.meetings.length > 0 ?
                    events.meetings.map((event, index) => {
                        return <EventRow eventData={event} date={this.props.date} key={index}/>
                    })
                    : <Text style={styles.noEventText}>No events</Text>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "stretch",
        flex: 1
    },
    separatorLine: {
        height: 1,
        backgroundColor: "#d3d3d3"
    },
    headerText: {
        fontWeight: '500',
        fontSize: 14,
        color: "#5e5e5e",
        marginLeft: 16,
        marginTop: 4,
        marginBottom: 4
    },
    noEventText: {
        marginLeft: 16,
        color: "#5e5e5e",
        fontSize: 12,
        marginTop: 16,
        marginBottom: 16
    }
});
