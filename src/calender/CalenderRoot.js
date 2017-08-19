import React, {Component} from 'react';
import CalenderVerticalList from './components/CalenderVerticalList';
import {View, Dimensions, StyleSheet} from 'react-native';
import CalenderView from './components/CalenderView';
import CalenderModelGenerator from "./data/CalenderModelGenerator";
import EventsList from "./data/EventsList";
import {DataProvider} from "recyclerlistview";

export default class CalenderRoot extends Component {
    constructor(props){
        super(props);
        this._calenderGenerator = new CalenderModelGenerator();

        this.state = {
            dataProvider: new DataProvider(
                function rowHasChanged(r1, r2) {
                    return r1.date.getTime() !== r2.date.getTime()
                }.bind(this)
            ).cloneWithRows(this._calenderGenerator.getModel()),
            eventsList: EventsList
        }
    }
    render() {
        const {dataProvider, eventsList} = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.calenderView}>
                    <CalenderView dataProvider={dataProvider} eventsList={eventsList}  />
                </View>
                <CalenderVerticalList dataProvider={dataProvider} eventsList={eventsList} style={styles.calenderVerticalList}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flex: 1
    },
    calenderView: {
        height: 5 * (Dimensions.get('window').width / 7)
    },
    calenderVerticalList: {
        flex: 1
    }
});

//
// import React, {Component} from 'react';
//
// export default class CalenderRoot extends Component {
//
// }
