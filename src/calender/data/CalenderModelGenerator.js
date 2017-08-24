import Constants from '../constants/Constants';
import {generateEventsForTS} from '../data/EventsList';

//Generates an array with date objects which can be used to power data providers of the recycler list view
export default class CalenderModelGenerator {
    constructor() {
        let currentDate = new Date();

        //Computing dates of day start
        this._startDate = new Date(currentDate.getFullYear() - 2, 1, 1, 0, 0, 0);
        this._endDate = new Date(currentDate.getFullYear() + 2, 1, 1, 0, 0, 0);

        this._model = [];
        this._currentDateIndex = 0;
        this._initialCompute();
    }

    //Generating the array, dates are incremented by adding number of milliseconds in a day to last added timestamp
    _initialCompute() {
        let startMS = this._startDate.getTime();
        let currentDayMS = new Date().getTime();
        let endMS = this._endDate.getTime();
        while (startMS < endMS) {
            //Computing which index would represent today
            if (currentDayMS - startMS >= 0 && currentDayMS - startMS < Constants.MILLISECONDS_IN_A_DAY) {
                this._currentDateIndex = this._model.length;
            }
            this._model.push({
                date: new Date(startMS)
            });

            //Generating dummy events to show in calender vertical list
            generateEventsForTS(startMS);

            startMS += Constants.MILLISECONDS_IN_A_DAY;
        }
    }

    getModel() {
        return this._model;
    }

    getCurrentDateIndex() {
        return this._currentDateIndex;
    }

    //Used to add more dates to the calender as you scroll down
    ensureYear(year) {
        let startMS = this._startDate.getTime();
        let endMS = this._endDate.getTime();
        let targetMS = new Date(year, 1).getTime();
        while (startMS > targetMS) {
            startMS -= Constants.MILLISECONDS_IN_A_DAY;
            this._model.push({
                date: new Date(startMS)
            });
        }
        while (endMS <= targetMS) {
            endMS += Constants.MILLISECONDS_IN_A_DAY;
            this._model.push({
                date: new Date(endMS)
            });
        }
        this._startDate = new Date(startMS);
        this._endDate = new Date(endMS);
    }

    getStartDate() {
        return this._startDate;
    }

    getEndDate() {
        return this._endDate;
    }
}
