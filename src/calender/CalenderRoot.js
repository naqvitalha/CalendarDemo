import React, {Component} from 'react';
import CalenderVerticalList from './components/CalenderVerticalList';
import {View, Dimensions, StyleSheet, Animated, StatusBar, Easing} from 'react-native';
import CalenderView from './components/CalenderView';
import CalenderModelGenerator from './data/CalenderModelGenerator';
import Header from './components/Header';
import BaseReduxRootComponent from '../shared/components/BaseReduxRootComponent';
import Reducer from './reducers/Reducer';
import Actions from './actions/Actions';
import Constants from './constants/Constants';

//Computing transform to animate the list up/down to give calender more area
const minTopOffset = Constants.CELL_SIDE_LENGTH + 74;
const maxTopOffset = Constants.CELL_SIDE_LENGTH * 5 + 75;

/***
 * Extending from BaseReduxComponent wrote it as a small implementation of redux, good to reduce boiler plate
 * Allows unidirectional data flow which makes debugging very simple
 *
 * OVERVIEW: CalenderModelGenerator generates an array of days extending to 2 years in future and past. This array
 * is used as data provider for the RecyclerListView. Initial index is determined using current time and passed to the
 * ListView and since it only draws the visible section we get a very quick load.
 * Same is done for the CalenderView which is again using the ReyclerListView.
 *
 * Now as any of the list is scroll we track visible index to figure out current selected date which is maintained in
 * redux store. Both lists share the same state thus changing selection on one will affect the other
 */

export default class CalenderRoot extends BaseReduxRootComponent {
    constructor(props) {
        super(props);

        //Initializing redux component with action/reducers
        this.addReducers(Reducer);
        this.addActions(Actions);

        //Generates the data model for vertical list and the calenderview
        this._calenderGenerator = new CalenderModelGenerator();

        //Animated values to animate opacity during load time and move list up/down while scrolling calender
        this._verticalListOffset = new Animated.Value(minTopOffset);
        this._containerOpacity = new Animated.Value(0);

        //Initial state
        this.state = {
            eventsList: {},
            selectedTimeStamp: new Date().getTime()
        };
    }

    componentWillMount() {
        //Mimicking network call which will get us all the events, non blocking for the rendering flow
        //getAllActions return all the actions that are a part of redux flow
        this.getAllActions().getCalenderEventsForDuration(null, null);
    }

    componentDidMount() {
        //Fading in the entire container, also helps in hiding the delay in showing content that occurs due to 1 missed
        //frame. Async nature of react native prevents you from being able to know dimensions of your view without
        //skipping a frame. RecyclerListView needs to wait for the draw to happen to know its dimensions.
        Animated.timing(this._containerOpacity, {
            toValue: 1,
            duration: 300,
            easing: Easing.easeOut,
            useNativeDriver: true
        }).start();
    }

    //Root always rerenders, components decide whether they have to or not.
    shouldComponentUpdate(newProps, newState) {
        if (newState.selectedIndex !== this.state.selectedIndex) {
            //Depending upon selection change origin scroll the relevant list to the right index.
            if (newState.origin !== 'CALENDER_VERTICAL_VIEW') {
                this._calenderVerticalRef.scrollToIndex(newState.selectedIndex);
            } else {
                this._calenderViewRef.scrollToIndex(newState.selectedIndex);
            }
        }
        return true;
    }

    _handleCalenderViewBeginDrag = () => {
        //On scrolling calender view, this animation moves the vertical list down using only transforms
        //Using native drivers so that the animation is run on native layer and not in javascript
        Animated.timing(this._verticalListOffset, {
            toValue: maxTopOffset,
            duration: 200,
            easing: Easing.easeOut,
            useNativeDriver: true
        }).start();
    };

    _handleCalenderVerticalBeginDrag = () => {
        //On scrolling vertical view, this animation moves the vertical list up using only transforms
        Animated.timing(this._verticalListOffset, {
            toValue: minTopOffset,
            duration: 200,
            easing: Easing.easeOut,
            useNativeDriver: true
        }).start();
    };

    render() {
        const {dataProvider, eventsList} = this.state;

        //If you look closely, vertical list is partially above the calender view. Did this so that the list
        //can be moved just with transforms. Avoiding height animation to reduce janks.
        //1X Overdraw only except in the region where vertical list and calender view are overlapping
        return (
            <Animated.View style={[styles.container, {opacity: this._containerOpacity}]}>
                <Header selectedTimeStamp={this.state.selectedTimeStamp} />
                <View style={styles.calenderView}>
                    <CalenderView
                        ref={x => (this._calenderViewRef = x)}
                        initialRenderIndex={this._calenderGenerator.getCurrentDateIndex()}
                        onScrollBeginDrag={this._handleCalenderViewBeginDrag}
                        actions={this.getAllActions()}
                        dateModel={this._calenderGenerator.getModel()}
                        selectedTimeStamp={this.state.selectedTimeStamp}
                        dataProvider={dataProvider}
                        eventsList={eventsList}
                    />
                </View>
                <Animated.View style={[styles.verticalListContainer, {transform: [{translateY: this._verticalListOffset}]}]}>
                    <CalenderVerticalList
                        ref={x => (this._calenderVerticalRef = x)}
                        initialRenderIndex={this._calenderGenerator.getCurrentDateIndex()}
                        onScrollBeginDrag={this._handleCalenderVerticalBeginDrag}
                        actions={this.getAllActions()}
                        dateModel={this._calenderGenerator.getModel()}
                        eventsList={eventsList}
                        style={styles.calenderVerticalList}
                    />
                    {/* Mimicking elevation with 1px with */}
                    <View
                        style={{
                            height: 1,
                            position: 'absolute',
                            flex: 1,
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: Constants.VERY_LIGH_GREY,
                            elevation: 2
                        }}
                    />

                </Animated.View>
            </Animated.View>
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
        height: 5 * Constants.CELL_SIDE_LENGTH
    },
    calenderVerticalList: {
        flex: 1
    },
    verticalListContainer: {
        flex: 1,
        alignItems: 'stretch',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        paddingBottom: minTopOffset
    }
});
