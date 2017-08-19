const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
export default class CalenderHelper {
    static getDayName(date) {
        return days[date.getDay()];
    }

    static getMonthName(date) {
        return monthNames[date.getMonth()];
    }

    static getShortMonthName(date) {
        return shortMonthNames[date.getMonth()];
    }

    static getAllDays() {
        return days;
    }
}
