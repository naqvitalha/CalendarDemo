import React, {Component} from 'react';
import {RecyclerListView, DataProvider, LayoutProvider} from "recyclerlistview";
import {Text, View, StyleSheet, Dimensions, FlatList} from "react-native";
import CalenderModelGenerator from "../data/CalenderModelGenerator";
import EventsList from "../data/EventsList";
import ListItemTypes from "../constants/ListItemTypes";
import DayCalenderItem from "./DayCalenderItem";

const {width} = Dimensions.get('window');

export default class CalenderVerticalList extends Component {
    constructor(props) {
        super(props);

        this._layoutProvider = new LayoutProvider(
            function getLayoutForIndex(index) {
                const dateItem = this.props.dataProvider.getDataForIndex(index);
                const events = this.props.eventsList[dateItem.date.getTime()];
                if (events && events.meetings && events.meetings.length > 0) {
                    return ListItemTypes.ITEM_WITH_EVENTS;
                }
                else {
                    return ListItemTypes.ITEM_WITH_NO_EVENTS;
                }
            }.bind(this)
        );

        this._layoutProvider.setLayoutForType = function (type, dim, index) {
            const dateItem = this.props.dataProvider.getDataForIndex(index);
            const events = this.props.eventsList[dateItem.date.getTime()];
            if (events && events.meetings && events.meetings.length > 0) {
                dim.height = 50;
            }
            else {
                dim.height = 50;
            }
            dim.width = width;
        }.bind(this)
    }

    // _rowRenderer1 = (data) => {
    //     data=data.item;
    //     return <DayCalenderItem events={this.props.eventsList[data.date.getTime()]} date={data.date}/>
    // };

    _rowRenderer = (type, data) => {
        return <DayCalenderItem events={this.props.eventsList[data.date.getTime()]} date={data.date}/>
    };

    _onEndReached = () => {
        // this._calenderGenerator.ensureYear(this._calenderGenerator.getEndDate().getFullYear() + 1);
        // this.setState({
        //     dataProvider: this.state.dataProvider.cloneWithRows(this._calenderGenerator.getModel())
        // });
    };

    render() {
        return (<RecyclerListView style={this.props.style} layoutProvider={this._layoutProvider}
                                  dataProvider={this.props.dataProvider} forceNonDeterministicRendering={true}
                                  rowRenderer={this._rowRenderer} onEndReached={this._onEndReached}/>)
        // return (<FlatList style={this.props.style} layoutProvider={this._layoutProvider} data={this.props.dataProvider._data}
        //                           dataProvider={this.props.dataProvider} forceNonDeterministicRendering={true}
        //                           renderItem={this._rowRenderer1} onEndReached={this._onEndReached}/>)
    }
}

const styles = StyleSheet.create({

});