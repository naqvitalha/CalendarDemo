import React, {Component} from 'react';
import {Image, Text, View, StyleSheet} from "react-native";

export default class EventRow extends Component {
    static propTypes = {};

    render() {
        return (<View style={styles.container}>
            <View>
                <Text>8 PM</Text>
                <Text>2h</Text>
            </View>
            <Image></Image>
            <Image></Image>
            <View>
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
        flex: 1
    }
});