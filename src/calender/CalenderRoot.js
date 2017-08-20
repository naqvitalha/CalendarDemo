import React, {Component} from 'react';
import CalenderVerticalList from './components/CalenderVerticalList';
import {View, Dimensions, StyleSheet, Animated, Easing} from 'react-native';
import CalenderView from './components/CalenderView';
import CalenderModelGenerator from './data/CalenderModelGenerator';
import EventsList from './data/EventsList';
import {DataProvider} from 'recyclerlistview';
import Header from './components/Header';
import BaseReduxRootComponent from '../shared/components/BaseReduxRootComponent';
import Reducer from './reducers/Reducer';
import Actions from './actions/Actions';

export default class CalenderRoot extends BaseReduxRootComponent {
    constructor(props) {
        super(props);
        this.addReducers(Reducer);
        this.addActions(Actions);

        this._calenderGenerator = new CalenderModelGenerator();
        this._verticalListOffset = new Animated.Value(130);

        this.state = {
            dataProvider: new DataProvider(
                function rowHasChanged(r1, r2) {
                    return true; //r1.date.getTime() !== r2.date.getTime()
                }.bind(this)
            ).cloneWithRows(this._calenderGenerator.getModel()),
            eventsList: {},
            selectedTimeStamp: new Date().getTime()
        };
    }

    componentWillMount() {
        this.getAllActions().getCalenderEventsForDuration(null, null);
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
        Animated.timing(this._verticalListOffset, {toValue: 300, duration: 200, easing:Easing.easeOut, useNativeDriver: true}).start();
    };

    _handleCalenderVerticalBeginDrag = () => {
        Animated.timing(this._verticalListOffset, {toValue: 130, duration: 200, easing:Easing.easeOut, useNativeDriver: true}).start();
    };

    render() {
        const {dataProvider, eventsList} = this.state;
        return (
            <View style={styles.container}>
                <Header selectedTimeStamp={this.state.selectedTimeStamp}/>
                <View style={styles.calenderView}>
                    <CalenderView
                        ref={x => (this._calenderViewRef = x)}
                        onScrollBeginDrag={this._handleCalenderViewBeginDrag}
                        actions={this.getAllActions()}
                        selectedTimeStamp={this.state.selectedTimeStamp}
                        dataProvider={dataProvider}
                        eventsList={eventsList}
                    />
                </View>
                <Animated.View
                    style={[styles.verticalListContainer, {transform: [{translateY: this._verticalListOffset}]}]}>
                    <CalenderVerticalList
                        ref={x => (this._calenderVerticalRef = x)}
                        onScrollBeginDrag={this._handleCalenderVerticalBeginDrag}
                        actions={this.getAllActions()}
                        dataProvider={dataProvider}
                        eventsList={eventsList}
                        style={styles.calenderVerticalList}
                    />
                </Animated.View>
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
        backgroundColor: "white"
    }
});

//
// import React, {Component} from 'react';
//
// export default class CalenderRoot extends Component {
//
// }
