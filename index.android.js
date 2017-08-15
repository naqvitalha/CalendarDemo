/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions
} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';

export default class CalenderDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProvider: new DataProvider(() => {
                return true
            }).cloneWithRows(new Array(1000))
        }
        ;
        this._layoutProvider = new LayoutProvider(() => {
            return 0
        }, (type, dim) => {
            dim.height = 30;
            dim.width = Dimensions.get('window').width;
        })
    }

    _rowRenderer = (type, data) => {
        return (<View style={{flex:1, height:30}}><Text>Hellow</Text></View>);
    };

    render() {
        return (
            <View style={styles.container}>
                <RecyclerListView style={{flex:1}} forceNonDeterministicRendering={true} dataProvider={this.state.dataProvider} layoutProvider={this._layoutProvider}
                                  rowRenderer={this._rowRenderer}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent('CalenderDemo', () => CalenderDemo);
