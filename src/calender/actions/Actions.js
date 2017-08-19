import ActionTypes from "./ActionTypes";
import EventsList from "../data/EventsList";

const Actions = {
    getCalenderEventsForDuration(startDate, endDate) {
        //Just return random event data for now
        this.dispatch({type: ActionTypes.FETCH_CALENDER_EVENTS});
        this.dispatch({
            type: ActionTypes.FETCH_CALENDER_EVENTS_SUCCESS,
            data: {
                RESPONSE: {
                    events: EventsList
                }
            }
        });
    }
};
export default Actions;