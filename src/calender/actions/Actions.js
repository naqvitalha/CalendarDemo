import ActionTypes from "./ActionTypes";
import EventsList from "../data/EventsList";

const Actions = {
    getCalenderEventsForDuration(startDate, endDate) {
        //Ideally a network call will happen here
        this.dispatch({type: ActionTypes.FETCH_CALENDER_EVENTS});

        //Just return random event data for now
        this.dispatch({
            type: ActionTypes.FETCH_CALENDER_EVENTS_SUCCESS,
            data: {
                RESPONSE: {
                    events: EventsList
                }
            }
        });
    },
    updateSelectedDate(date, selectedIndex, origin){
        //Updating the current selected date in store so that changes in calender view apply on vertical one and vice versa
        //Passing the selected index as well to avoid computing the relevant index, the initiator anyways has the context
        this.dispatch({
            type: ActionTypes.CHANGE_SELECTED_DATE,
            selectedTimeStamp: date.getTime(),
            selectedIndex: selectedIndex,
            origin: origin
        });
    }
};
export default Actions;