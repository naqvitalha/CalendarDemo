import React, {Component} from 'react';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {Text, View, StyleSheet, Dimensions} from 'react-native';
import CalenderModelGenerator from '../data/CalenderModelGenerator';
import EventsList from '../data/EventsList';
import ListItemTypes from '../constants/ListItemTypes';
import DayCalenderItem from './DayCalenderItem';

const {width} = Dimensions.get('window');

export default class CalenderVerticalList extends Component {
    constructor(props) {
        super(props);

        //Classifying types as with events and without events so that we can reuse as much as possible
        //without unmounting too many
        this._layoutProvider = new LayoutProvider((index) => {
                const dateItem = this._dataProvider.getDataForIndex(index);
                const events = this.props.eventsList[dateItem.date.getTime()];
                if (events && events.meetings && events.meetings.length > 0) {
                    return ListItemTypes.ITEM_WITH_EVENTS;
                } else {
                    return ListItemTypes.ITEM_WITH_NO_EVENTS;
                }
            }
        );

        //Overriding base method, if you want index you need to override. Not creating a separate file since
        //this is simple enough
        //Deterministic model (exact dimensions) for perf reasons
        this._layoutProvider.setLayoutForType = function (type, dim, index) {
            const dateItem = this._dataProvider.getDataForIndex(index);
            const events = this.props.eventsList[dateItem.date.getTime()];
            if (events && events.meetings && events.meetings.length > 0) {
                dim.height = 28 + 80 * events.meetings.length;
            } else {
                dim.height = 80;
            }
            dim.width = width;
        }.bind(this);

        this._dataProvider = new DataProvider((r1, r2) => {
            return r1.date.getTime() !== r2.date.getTime();
        }).cloneWithRows(props.dateModel);

        this._lastFirstVisibleIndex = -1;
    }


    //only rerender if events have changed
    shouldComponentUpdate(newProps) {
        return this.props.eventsList !== newProps.eventsList;
    }

    componentWillUpdate() {
        this._dataProvider = this._dataProvider.cloneWithRows(this.props.dateModel);
    }

    scrollToIndex(index) {
        if (this._recyclerRef) {
            let offset = this._recyclerRef._virtualRenderer.getLayoutManager().getOffsetForIndex(index);
            this._recyclerRef.scrollToOffset(0, offset.y + 1, false);
        }
    }

    //Only one type, returing the item representing the day events
    _rowRenderer = (type, data) => {
        return <DayCalenderItem events={this.props.eventsList[data.date.getTime()]} date={data.date}/>;
    };

    _onEndReached = () => {
        //Can add more duration to the calender here
    };

    //Determining the selected date, this callback provides all visible indexes
    //The first in all list will, obviously, be the selected one
    //Updating the state through action accordingly
    _handleVisibleIndexChanges = all => {
        const firstVisibleIndex = all[0];
        if (this._lastFirstVisibleIndex !== firstVisibleIndex) {
            this._lastFirstVisibleIndex = firstVisibleIndex;
            this.props.actions.updateSelectedDate(this._dataProvider.getDataForIndex(firstVisibleIndex).date, firstVisibleIndex, 'CALENDER_VERTICAL_VIEW');
        }
    };

    render() {
        return (
            <RecyclerListView
                layoutProvider={this._layoutProvider}
                ref={x => (this._recyclerRef = x)}
                initialRenderIndex={this.props.initialRenderIndex}
                onVisibleIndexesChanged={this._handleVisibleIndexChanges}
                dataProvider={this._dataProvider}
                onScrollBeginDrag={this.props.onScrollBeginDrag}
                forceNonDeterministicRendering={false}
                rowRenderer={this._rowRenderer}
                onEndReached={this._onEndReached}
            />
        );
    }
}
