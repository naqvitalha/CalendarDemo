import ActionTypes from '../actions/ActionTypes';

const Reducers = [
    (changeSelectedDate = (state, actionObj) => {
        if (actionObj.type === ActionTypes.CHANGE_SELECTED_DATE) {
            return Object.assign({}, state, {selectedTimeStamp: actionObj.selectedTimeStamp, selectedIndex: actionObj.selectedIndex, origin:actionObj.origin});
        }
        return state;
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
