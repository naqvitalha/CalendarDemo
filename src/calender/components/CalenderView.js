import React, {Component} from 'react';
import {Text, View, Animated, Easing, StyleSheet} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import CalenderDateViewTypes from '../constants/CalenderDateViewTypes';
import CalenderViewCell from './CalenderViewCell';
import CalenderHelper from '../../shared/utils/CalenderHelper';
import Constants from '../constants/Constants';

/***
 * Renders the calender view which displays the full month view
 * Show month for first date for the month and indicates whether events are present using a dot
 * on the bottom of each cell
 * Performance here was challenge, I noticed even in paystore outlook app there are lot of dropped frames in this area
 * Have made lot of creative improvement to performance
 */

export default class CalenderView extends Component {
    constructor(props) {
        super(props);
        this._layoutProvider = new LayoutProvider(
            index => {

                //Here we are supposed to return a type to recycler view, I'm using date (1-31) as the type so that on
                //recycling the component can avoid a text relayout. If the date is same value of the text doesn't have
                //to change at all!
                return index ? this._dataProvider.getDataForIndex(index).date.getDate() : CalenderDateViewTypes.FIRST_ITEM;
            },

            //Providing heights and widths for given types, doing deterministic way for perf
            (type, dim) => {
                switch (type) {
                    case CalenderDateViewTypes.FIRST_ITEM:
                        dim.width = Constants.CELL_SIDE_LENGTH;
                        break;
                    default:
                        dim.width = Constants.CELL_SIDE_LENGTH;
                }
                dim.height = Constants.CELL_SIDE_LENGTH;
            }
        );

        this._dataProvider = new DataProvider((r1, r2) => {

            //This should clearly to be returning true, working on this. This will slow down things.
            return true;
        }).cloneWithRows(props.dateModel);

        //To detect if a scroll is in progress
        this._isScrolling = false;

        //To infer direction of scroll
        this._lastYOffset = 0;

        //Would've been used for snap scrolling, not doing it now though
        this._lastScrollDirection = 'UP';

        this.state = {
            calenderOpacity: new Animated.Value(1),
            textOpacity: new Animated.Value(0),
            monthName: null
        };
    }

    //Only rerender if month, events or selected item has changed
    shouldComponentUpdate(newProps, newState) {
        return (
            this.state.monthName !== newState.monthName ||
            newProps.eventsList !== this.props.eventsList ||
            newProps.selectedTimeStamp !== this.props.selectedTimeStamp
        );
    }

    scrollToIndex(index) {
        if (this._recyclerRef) {

            //Scrolling a pixel more to avoid triggering incorrect scroll. Not using scrollToIndex directly for
            //the same reason
            let offset = this._recyclerRef._virtualRenderer.getLayoutManager().getOffsetForIndex(index);
            this._recyclerRef.scrollToOffset(0, Math.ceil(offset.y + 1), false);
        }
    }

    //Since we only have one type of view, returning it directly
    _rowRenderer = (type, data, index) => {
        const date = data.date;
        const events = this.props.eventsList[date.getTime()];
        return (
            <CalenderViewCell currentIndex={index} actions={this.props.actions} selectedTimeStamp={this.props.selectedTimeStamp} date={date} events={events} />
        );
    };

    //RecyclerListView provides a visible indexes changed callback
    //From the all list checking the middle index and the data on it  decide which month to show on the overlay
    //that appears while scrolling
    _handleVisibleIndexChanges = (all, now, notNow) => {
        const relevantIndex = Math.ceil(all.length / 2);
        const data = this._dataProvider.getDataForIndex(all[relevantIndex]);
        const newMonth = CalenderHelper.getMonthName(data.date);
        const yearText = new Date().getFullYear() !== data.date.getFullYear() ? ', ' + data.date.getFullYear() : '';

        //if moth has changed updating the text on overlay
        if (newMonth !== this.state.monthName) {
            this.setState({monthName: newMonth + yearText});
        }
    };

    //Hiding the overlay using animation after scroll ends even the momentum one.
    //Will only be hiding overlay 300ms after the end, if the user scroll again in the meanwhile this will get cancelled
    _handleScrollEnd = () => {
        this._isScrolling = false;
        setTimeout(() => {
            if (!this._isScrolling) {
                //Skipping snap scrolling for now
                // const distanceFromSnapInterval = Math.ceil(this._lastYOffset) % Math.ceil(cellSideLength);
                // if (distanceFromSnapInterval > 0) {
                //     if (this._lastScrollDirection === "UP") {
                //         this._recyclerRef.scrollToOffset(0, Math.ceil(this._lastYOffset) + Math.ceil(cellSideLength) - distanceFromSnapInterval, true);
                //     }
                //     else {
                //         this._recyclerRef.scrollToOffset(0, Math.ceil(this._lastYOffset) -  distanceFromSnapInterval, true);
                //     }
                //     return;
                // }
                Animated.parallel([
                    Animated.timing(this.state.calenderOpacity, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                        easing: Easing.easeOut
                    }),
                    Animated.timing(this.state.textOpacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                        easing: Easing.easeOut
                    })
                ]).start();
            }
        }, 300);
    };

    //Showing month overlay using animation, also using a boolean to track scrolling
    _handleScrollStart = () => {
        this.props.onScrollBeginDrag();
        if (!this._isScrolling) {
            this._isScrolling = true;
            Animated.parallel([
                Animated.timing(this.state.calenderOpacity, {
                    toValue: 0.2,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.easeIn
                }),
                Animated.timing(this.state.textOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.easeIn
                })
            ]).start();
        }
    };

    //Not using for now
    // _onScroll = (r, x, y) => {
    //     this._lastScrollDirection = y > this._lastYOffset ? 'UP' : 'DOWN';
    //     this._lastYOffset = y;
    // };

    render() {
        return (
            <View style={{flex: 1}}>
                <Animated.View style={{flex: 1, opacity: this.state.calenderOpacity}}>
                    <RecyclerListView
                        layoutProvider={this._layoutProvider}
                        dataProvider={this._dataProvider}
                        rowRenderer={this._rowRenderer}
                        ref={ref => (this._recyclerRef = ref)}
                        renderAheadOffset={300}
                        initialRenderIndex={this.props.initialRenderIndex}
                        showsVerticalScrollIndicator={false}
                        onVisibleIndexesChanged={this._handleVisibleIndexChanges}
                        onScrollBeginDrag={this._handleScrollStart}
                        onScrollEndDrag={this._handleScrollEnd}
                        onMomentumScrollBegin={this._handleScrollStart}
                        onMomentumScrollEnd={this._handleScrollEnd}
                        //onScroll={this._onScroll}
                    />
                </Animated.View>
                <Animated.View pointerEvents="none" style={[styles.textContainer, {opacity: this.state.textOpacity}]}>
                    <Text style={styles.monthText}>{this.state.monthName}</Text>
                </Animated.View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    monthText: {
        fontSize: 18,
        backgroundColor: 'transparent'
    },
    textContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
