const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
export default class CalenderHelper {
    static getDayName(date) {
        return days[date.getDay()];
    }
    static getMonthName(date) {
        return monthNames[date.getMonth()];
    }
}
