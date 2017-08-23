import Constants from "../constants/Constants";
import EventTypes from "../constants/EventTypes";

const EventsList = {};

const DummyEvents = [
    {
        eventType: EventTypes.BIRTHDAY,
        eventMeta: {
            name: "Rahul",
            birthdayTS: 2342343,
        }
    },
    {
        eventType: EventTypes.DINNER,
        eventMeta: {
            name: "Arjun",
            birthdayTS: 2342343,
            startTS: 3424442,
            endTS: 343535
        }
    },
    {
        eventType: EventTypes.MEETING,
        eventMeta: {
            name: "Richa",
            birthdayTS: 2342343,
            startTS: 3424442,
            endTS: 343535
        }
    },
    {
        eventType: EventTypes.LUNCH,
        eventMeta: {
            name: "Arjun",
            birthdayTS: 2342343,
            startTS: 3424442,
            endTS: 343535
        }
    }

];

function getRandomEvent() {
    return Object.assign({}, DummyEvents[getRandomInt(0, 3)]);
}

function getRandomScheduleForDay() {
    let eventCount = getRandomInt(0, 1) === 0 ? 3 : 0;
    let schedule = {
        lastUpdateTimeStamp: 908,
        meetings: []
    }
    for (let i = 0; i < eventCount; i++) {
        schedule.meetings.push(getRandomEvent());
    }
    return schedule;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEventsForTS(timeStamp) {
    EventsList[timeStamp] = getRandomScheduleForDay();
}

export {
    generateEventsForTS
};

export default EventsList;