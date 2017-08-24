import React, {Component} from 'react';
class BaseReduxRootComponent extends React.Component {
    addReducer(reducer) {
        if (!this.reducerList) {
            this.reducerList = [];
        }
        this.reducerList.push(reducer);
    }

    addReducers(reducers) {
        if (!this.reducerList) {
            this.reducerList = [];
        }
        reducers.forEach(r => {
            this.reducerList.push(r);
        }, this);
    }

    //Passes an action to all reducers and expects a finalized state in the end
    dispatch(action) {
        if (this.reducerList && this.state) {
            let length = this.reducerList.length;
            let lastState = this.state;
            for (let i = 0; i < length; i++) {
                lastState = this.reducerList[i](lastState, action);
            }
            this.setState((prevState, props) => {
                return lastState;
            });
        }
    }

    getRoot() {
        return this;
    }

    addActions(actionMap) {
        if (!this.actionMap) {
            this.actionMap = {dispatcher: this.dispatch.bind(this), dispatch: this.dispatch.bind(this), getRoot: this.getRoot.bind(this)};
        }
        Object.assign(this.actionMap, actionMap);
    }

    getAllActions() {
        return this.actionMap;
    }
}
export default BaseReduxRootComponent;
