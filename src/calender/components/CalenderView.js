import React, {Component} from 'react';
import {Dimensions, Text, View, Animated, Easing, StyleSheet} from "react-native";
import {RecyclerListView, DataProvider, LayoutProvider} from "recyclerlistview";
import CalenderDateViewTypes from "../constants/CalenderDateViewTypes";
import CalenderViewCell from "./CalenderViewCell";
import CalenderHelper from "../../shared/utils/CalenderHelper";
import Constants from "../constants/Constants";


export default class CalenderView extends Component {
    constructor(props) {
        super(props);
        this._layoutProvider = new LayoutProvider(
            (index) => {
                return index ? this._dataProvider.getDataForIndex(index).date.getDate() : CalenderDateViewTypes.FIRST_ITEM;
            },
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

        this._dataProvider = new DataProvider(
            function rowHasChanged(r1, r2) {
                return false; //r1.date.getTime() !== r2.date.getTime()
            }.bind(this)
        ).cloneWithRows(props.dateModel),

        this._isScrolling = false;
        this._lastYOffset = 0;

        //Would've been used for snap scrolling, not doing it now though
        this._lastScrollDirection = "UP";

        this.state = {
            calenderOpacity: new Animated.Value(1),
            textOpacity: new Animated.Value(0),
            monthName: null
        }
    }

    shouldComponentUpdate(newProps, newState) {
        return this.state.monthName !== newState.monthName ||
            newProps.eventsList !== this.props.eventsList ||
            newProps.selectedTimeStamp !== this.props.selectedTimeStamp;
    }

    scrollToIndex(index) {
        if (this._recyclerRef) {
            this._recyclerRef.scrollToIndex(index, false);
        }
    }


    _rowRenderer = (type, data, index) => {
        const date = data.date;
        const events = this.props.eventsList[date.getTime()];
        return <CalenderViewCell currentIndex={index} actions={this.props.actions}
                                 selectedTimeStamp={this.props.selectedTimeStamp} date={date} events={events}/>

    };

    _handleVisibleIndexChanges = (all, now, notNow) => {
        const relevantIndex = Math.ceil(all.length / 2);
        const data = this._dataProvider.getDataForIndex(all[relevantIndex]);
        const newMonth = CalenderHelper.getMonthName(data.date);
        const yearText = new Date().getFullYear() !== data.date.getFullYear() ? ", " + data.date.getFullYear() : "";
        if (newMonth !== this.state.monthName) {
            this.setState({monthName: newMonth + yearText})
        }
    };

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

    _onScroll = (r, x, y) => {
        this._lastScrollDirection = y > this._lastYOffset ? "UP" : "DOWN";
        this._lastYOffset = y;
    };


    render() {
        return (
            <View style={{flex: 1}}>
                <Animated.View style={{flex: 1, opacity: this.state.calenderOpacity}}>
                    <RecyclerListView layoutProvider={this._layoutProvider} dataProvider={this._dataProvider}
                                      rowRenderer={this._rowRenderer}
                                      ref={(ref) => this._recyclerRef = ref}
                                      renderAheadOffset={300}
                                      //disableRecycling={true}
                                      initialRenderIndex={this.props.initialRenderIndex}
                                      showsVerticalScrollIndicator={false}
                                      onVisibleIndexesChanged={this._handleVisibleIndexChanges}
                                      onScrollBeginDrag={this._handleScrollStart}
                                      onScrollEndDrag={this._handleScrollEnd}
                                      onMomentumScrollBegin={this._handleScrollStart}
                                      onMomentumScrollEnd={this._handleScrollEnd}
                                      onScroll={this._onScroll}

                    />
                </Animated.View>
                <Animated.View pointerEvents="box-none"
                               style={[styles.textContainer, {opacity: this.state.textOpacity}]}>
                    <Text style={styles.monthText}>{this.state.monthName}</Text>
                </Animated.View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    monthText: {
        fontSize: 18,
        backgroundColor: "transparent"
    },
    textContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center"
    }
});