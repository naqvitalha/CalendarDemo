import React, {Component} from 'react';
import {RecyclerListView, DataProvider, LayoutProvider} from "recyclerlistview";
import {Text, View, StyleSheet, Dimensions} from "react-native";
import CalenderModelGenerator from "../data/CalenderModelGenerator";
import EventsList from "../data/EventsList";
import ListItemTypes from "../constants/ListItemTypes";
import DayCalenderItem from "./DayCalenderItem";

const {width} = Dimensions.get('window');

export default class CalenderVerticalList extends Component {
    constructor(props) {
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

        this._layoutProvider = new LayoutProvider(
            function getLayoutForIndex(index) {
                const dateItem = this.state.dataProvider.getDataForIndex(index);
                const events = this.state.eventsList[dateItem.date.getTime()];
                if (events && events.meetings && events.meetings.length > 0) {
                    return ListItemTypes.ITEM_WITH_EVENTS;
                }
                else {
                    return ListItemTypes.ITEM_WITH_NO_EVENTS;
                }
            }.bind(this)
        );

        this._layoutProvider.setLayoutForType = function (type, dim, index) {
            const dateItem = this.state.dataProvider.getDataForIndex(index);
            const events = this.state.eventsList[dateItem.date.getTime()];
            if (events && events.meetings && events.meetings.length > 0) {
                dim.height = 50;
            }
            else {
                dim.height = 50;
            }
            dim.width = width;
        }.bind(this)
    }

    _rowRenderer = (type, data) => {
        return <DayCalenderItem date={data.date}/>
    };

    _onEndReached = () => {
        this._calenderGenerator.ensureYear(this._calenderGenerator.getEndDate().getFullYear() + 1);
        this.setState({
            dataProvider: this.state.dataProvider.cloneWithRows(this._calenderGenerator.getModel())
        });
    };

    render() {
        return (<RecyclerListView style={styles.recycler} layoutProvider={this._layoutProvider}
                                  dataProvider={this.state.dataProvider} forceNonDeterministicRendering={true}
                                  rowRenderer={this._rowRenderer} onEndReached={this._onEndReached}/>)
    }
}

const styles = StyleSheet.create({
    recycler: {
        flex: 1
    }
});