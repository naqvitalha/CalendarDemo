import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import CalenderRoot from './calender/CalenderRoot';

export default class OutlookRoot extends Component {
    //Designed Calender root as a component that is reusable and not tightly knit with the application
    //Any other view or navigator can load it up, this not unnecessarily adding a nav library to the project

    //This methods return CalenderRoot inside a completely stretched parent container.
    render() {
        return (
            <View style={styles.container}>
                <CalenderRoot />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
    }
});
