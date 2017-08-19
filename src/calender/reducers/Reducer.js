import ActionTypes from '../actions/ActionTypes';

const Reducers = [
    (changeSelectedDate = (state, actionObj) => {
        return Object.assign({}, state, {selectedTimeStamp: actionObj.selectedTimeStamp});
    }),
    (updateEvents = (state, actionObj) => {
        if (actionObj.type === ActionTypes.FETCH_CALENDER_EVENTS_SUCCESS) {
            return Object.assign({}, state, {
                eventsList: Object.assign({}, state.eventsList, actionObj.data.RESPONSE.events)
            });
        }
        return state;
    })
];
export default Reducers;
