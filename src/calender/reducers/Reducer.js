import ActionTypes from '../actions/ActionTypes';

/***
 * The job of reducers is just to modify the state based on what action was performed
 */

const Reducers = [
    //Changes the selected time stamp
    (changeSelectedDate = (state, actionObj) => {
        if (actionObj.type === ActionTypes.CHANGE_SELECTED_DATE) {
            return Object.assign({}, state, {selectedTimeStamp: actionObj.selectedTimeStamp, selectedIndex: actionObj.selectedIndex, origin:actionObj.origin});
        }
        return state;
    }),

    //Updates fetched events in the state
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
