import Constants from "../constants/Constants";

export default class CalenderModelGenerator {
    constructor() {
        let currentDate = new Date();
        this._startDate = new Date(currentDate.getFullYear() - 1, 1, 1, 0, 0, 0)
        this._endDate = new Date(currentDate.getFullYear() + 1, 1, 1, 0, 0, 0);
        this._model = [];
        this._initialCompute();
    }

    _initialCompute() {
        let startMS = this._startDate.getTime();
        let endMS = this._endDate.getTime();
        while (startMS < endMS) {
            this._model.push({
                date: new Date(startMS)
            })
            startMS += Constants.MILLISECONDS_IN_A_DAY
        }
    }

    getModel() {
        return this._model;
    }

    ensureYear(year) {
        let startMS = this._startDate.getTime();
        let endMS = this._endDate.getTime();
        let targetMS = new Date(year, 1).getTime();
        while (startMS > targetMS) {
            startMS -= Constants.MILLISECONDS_IN_A_DAY
            this._model.push({
                date: new Date(startMS)
            })
        }
        while (endMS <= targetMS) {
            endMS += Constants.MILLISECONDS_IN_A_DAY
            this._model.push({
                date: new Date(endMS)
            })
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