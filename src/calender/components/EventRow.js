import React, {Component} from 'react';
import {Image, Text, View, StyleSheet} from "react-native";
import EventTypes from "../constants/EventTypes";

const EventImages = {};

EventImages[EventTypes.BIRTHDAY] = require("../../../assets/birthday_icon.png");
EventImages[EventTypes.MEETING] = require("../../../assets/meeting_icon.jpg");
EventImages[EventTypes.LUNCH] = require("../../../assets/dinner_icon.png");
EventImages[EventTypes.DINNER] = require("../../../assets/dinner_icon.png");

export {EventImages};

export default class EventRow extends Component {
    static propTypes = {};

    constructor(props) {
        super(props);
    }

    _renderEventImage() {

    }

    _renderTimeText() {
        const date = this.props.date;
        return <Text style={styles.timeInfoText}>{date.getHours() + ":" + date.getMinutes()}</Text>;
    }

    _renderDurationText() {
        if (this.props.eventData.eventType !== EventTypes.BIRTHDAY) {
            const event = this.props.eventData;
            const duration = event.eventMeta.startTS - event.eventMeta.endTS;
            let minutes = parseInt((duration / (1000 * 60)) % 60), hours = parseInt((duration / (1000 * 60 * 60)) % 24);
            let stringText = "";
            if (hours) {
                stringText += hours + "h";
            }
            if (minutes) {
                stringText += (hours ? ":" : null) + minutes + "m";
            }
            return <Text style={styles.durationText}>{stringText}</Text>;
        }
        else {
            return null;
        }

    }

    _renderEventImage() {
        return <Image style={styles.eventImage} source={EventImages[this.props.eventData.eventType]}/>
    }

    render() {
        return (<View style={styles.container}>
            <View style={styles.timeSectionContainer}>
                {this._renderTimeText()}
                {this._renderDurationText()}
            </View>
            {this._renderEventImage()}
            <Image></Image>
            <View style={styles.detailContainer}>
                <Text>Dinner with John Doe</Text>
                <View>
                    <Image></Image><Text>Bangalore, India</Text>
                </View>
            </View>
        </View>)
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 70,
        backgroundColor: "#dfdfdf",
        alignItems: "center"
    },
    timeSectionContainer: {
        paddingLeft: 16,
        paddingRight: 16,
        maxWidth: 54
    },
    timeInfoText: {
        fontSize: 14,
        textAlign: "center",
    },
    durationText: {
        fontSize: 10,
        textAlign: "center",
    },
    eventImage: {
        height: 25,
        width: 25
    },
    detailContainer:{
        marginLeft: 12,
    }
});