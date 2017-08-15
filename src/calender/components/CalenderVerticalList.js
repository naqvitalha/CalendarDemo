import React, {Component} from 'react';
import {RecyclerListView, DataProvider, LayoutProvider} from "recyclerlistview";
import {Text, View, StyleSheet, Dimensions} from "react-native";
import CalenderModelGenerator from "../data/CalenderModelGenerator";

const width = Dimensions.get('window').width;

export default class CalenderVerticalList extends Component {
    constructor(props) {
        super(props);
        this._layoutProvider = new LayoutProvider(
            function getLayoutForIndex(index) {
                return 0;
            },
            function setLayoutForType(type, dim) {
                dim.width = width;
                dim.height = 50;
            }
        );
        this._calenderGenerator = new CalenderModelGenerator();

        this.state = {
            dataProvider: new DataProvider(
                function rowHasChanged(r1, r2) {
                    return r1.date.getMilliseconds() !== r2.date.getMilliseconds()
                }
            ).cloneWithRows(this._calenderGenerator.getModel())
        }
    }

    _rowRenderer = (type, data) => {
        return (<View><Text>{data.date.toUTCString}</Text></View>)
    }

    render() {
        return (<RecyclerListView style={styles.recycler} layoutProvider={this._layoutProvider} dataProvider={this.state.dataProvider}
                                  rowRenderer={this._rowRenderer}/>)
    }
}

const styles = StyleSheet.create({
    recycler:{
        flex:1
    }
});