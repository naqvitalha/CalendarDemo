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

        this._layoutProvider = new LayoutProvider(
            function getLayoutForIndex(index) {
                const dateItem = this._dataProvider.getDataForIndex(index);
                const events = this.props.eventsList[dateItem.date.getTime()];
                if (events && events.meetings && events.meetings.length > 0) {
                    return ListItemTypes.ITEM_WITH_EVENTS;
                } else {
                    return ListItemTypes.ITEM_WITH_NO_EVENTS;
                }
            }.bind(this)
        );

        //Overriding basing function
        this._layoutProvider.setLayoutForType = function(type, dim, index) {
            const dateItem = this._dataProvider.getDataForIndex(index);
            const events = this.props.eventsList[dateItem.date.getTime()];
            if (events && events.meetings && events.meetings.length > 0) {
                dim.height = 28 + 80 * events.meetings.length;
            } else {
                dim.height = 80;
            }
            dim.width = width;
        }.bind(this);

        this._dataProvider = new DataProvider(
            function rowHasChanged(r1, r2) {
                return r1.date.getTime() !== r2.date.getTime();
            }.bind(this)
        ).cloneWithRows(props.dateModel);
        this._lastFirstVisibleIndex = -1;
    }

    shouldComponentUpdate(newProps) {
        return this.props.eventsList !== newProps.eventsList;
    }

    componentWillUpdate() {
        this._dataProvider = this._dataProvider.cloneWithRows(this.props.dateModel);
    }

    scrollToIndex(index) {
        if (this._recyclerRef) {
            this._recyclerRef.scrollToIndex(index, false);
        }
    }

    _rowRenderer = (type, data) => {
        return <DayCalenderItem events={this.props.eventsList[data.date.getTime()]} date={data.date} />;
    };

    _onEndReached = () => {};

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
