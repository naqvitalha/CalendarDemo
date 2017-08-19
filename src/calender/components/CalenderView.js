import React, {Component} from 'react';
import {Dimensions, Text, View, Animated, Easing, StyleSheet} from "react-native";
import {RecyclerListView, LayoutProvider} from "recyclerlistview";
import CalenderDateViewTypes from "../constants/CalenderDateViewTypes";
import CalenderViewCell from "./CalenderViewCell";
import CalenderHelper from "../../shared/utils/CalenderHelper";

const cellSideLength = Dimensions.get('window').width / 7;

export default class CalenderView extends Component {
    constructor(props) {
        super(props);
        this._layoutProvider = new LayoutProvider(
            (index) => {
                return index ? CalenderDateViewTypes.REST_ITEMS : CalenderDateViewTypes.FIRST_ITEM;
            },
            (type, dim) => {
                switch (type) {
                    case CalenderDateViewTypes.FIRST_ITEM:
                        dim.width = cellSideLength;
                        dim.height = cellSideLength;
                        break;
                    case CalenderDateViewTypes.REST_ITEMS:
                        dim.width = cellSideLength;
                        dim.height = cellSideLength;
                        break;
                    default:
                        dim.width = 0;
                        dim.height = 0;
                }
            }
        );
        this._isScrolling = false;
        this.state = {
            calenderOpacity: new Animated.Value(1),
            textOpacity: new Animated.Value(0),
            monthName: null
        }
    }


    _rowRenderer = (type, data) => {
        const date = data.date;
        const events = this.props.eventsList[date.getTime()];
        return <CalenderViewCell date={date} events={events}/>

    };

    _handleVisibleIndexChanges = (all, now, notNow) => {
        const relevantIndex = Math.ceil(all.length / 2);
        const data = this.props.dataProvider.getDataForIndex(all[relevantIndex]);
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
        }, 100);
    };

    _handleScrollStart = () => {
        if (!this._isScrolling) {
            this._isScrolling = true;
            Animated.parallel([
                Animated.timing(this.state.calenderOpacity, {
                    toValue: 0.5,
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


    render() {
        return (
            <View style={{flex: 1}}>
                <Animated.View style={{flex: 1, opacity: this.state.calenderOpacity}}>
                    <RecyclerListView layoutProvider={this._layoutProvider} dataProvider={this.props.dataProvider}
                                      rowRenderer={this._rowRenderer}
                                      renderAheadOffset={300}
                                      onVisibleIndexesChanged={this._handleVisibleIndexChanges}
                                      onScrollBeginDrag={this._handleScrollStart}
                                      onMomentumScrollBegin={this._handleScrollStart}
                                      onMomentumScrollEnd={this._handleScrollEnd}
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