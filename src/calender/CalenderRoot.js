import React, {Component} from 'react';
import CalenderVerticalList from './components/CalenderVerticalList';
import {View, Dimensions, StyleSheet, Animated, StatusBar, Easing} from 'react-native';
import CalenderView from './components/CalenderView';
import CalenderModelGenerator from './data/CalenderModelGenerator';
import EventsList from './data/EventsList';
import {DataProvider} from 'recyclerlistview';
import Header from './components/Header';
import BaseReduxRootComponent from '../shared/components/BaseReduxRootComponent';
import Reducer from './reducers/Reducer';
import Actions from './actions/Actions';
import Constants from "./constants/Constants";

const minTopOffset = Constants.CELL_SIDE_LENGTH + 74;
const maxTopOffset = Constants.CELL_SIDE_LENGTH * 5 + 75;

export default class CalenderRoot extends BaseReduxRootComponent {
    constructor(props) {
        super(props);
        this.addReducers(Reducer);
        this.addActions(Actions);


        this._calenderGenerator = new CalenderModelGenerator();
        this._verticalListOffset = new Animated.Value(minTopOffset);
        this._containerOpacity = new Animated.Value(0);

        this.state = {
            eventsList: {},
            selectedTimeStamp: new Date().getTime()
        };
    }

    componentWillMount() {
        StatusBar.setBarStyle('light-content', true);
        this.getAllActions().getCalenderEventsForDuration(null, null);
    }

    componentDidMount(){
        Animated.timing(this._containerOpacity, {toValue: 1, duration: 300, easing:Easing.easeOut, useNativeDriver: true}).start();
    }

    shouldComponentUpdate(newProps, newState) {
        if (newState.selectedIndex !== this.state.selectedIndex) {
            if (newState.origin !== 'CALENDER_VERTICAL_VIEW') {
                this._calenderVerticalRef.scrollToIndex(newState.selectedIndex);
            } else {
                this._calenderViewRef.scrollToIndex(newState.selectedIndex);
            }
        }
        return true;
    }

    _handleCalenderViewBeginDrag = () => {
        Animated.timing(this._verticalListOffset, {toValue: maxTopOffset, duration: 200, easing:Easing.easeOut, useNativeDriver: true}).start();
    };

    _handleCalenderVerticalBeginDrag = () => {
        Animated.timing(this._verticalListOffset, {toValue: minTopOffset, duration: 200, easing:Easing.easeOut, useNativeDriver: true}).start();
    };

    render() {
        const {dataProvider, eventsList} = this.state;
        return (
            <Animated.View style={[styles.container,{opacity: this._containerOpacity}]}>
                <Header selectedTimeStamp={this.state.selectedTimeStamp}/>
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
                <Animated.View
                    style={[styles.verticalListContainer, {transform: [{translateY: this._verticalListOffset}]}]}>
                    <CalenderVerticalList
                        ref={x => (this._calenderVerticalRef = x)}
                        initialRenderIndex={this._calenderGenerator.getCurrentDateIndex()}
                        onScrollBeginDrag={this._handleCalenderVerticalBeginDrag}
                        actions={this.getAllActions()}
                        dateModel={this._calenderGenerator.getModel()}
                        eventsList={eventsList}
                        style={styles.calenderVerticalList}
                    />
                    <View style={{height:1, position:"absolute", flex:1, top:0,
                        left:0, right:0, bottom:0, backgroundColor:Constants.VERY_LIGH_GREY, elevation: 2}}/>

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
        height: 5 * (Dimensions.get('window').width / 7)
    },
    calenderVerticalList: {
        flex: 1,
    },
    verticalListContainer: {
        flex: 1,
        alignItems: "stretch",
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "white",
        paddingBottom: minTopOffset
    }
});

//
// import React, {Component} from 'react';
//
// export default class CalenderRoot extends Component {
//
// }
