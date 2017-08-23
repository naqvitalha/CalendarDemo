import EventTypes from "./EventTypes";
import {Dimensions} from "react-native";

const Constants = Object.freeze({
    MILLISECONDS_IN_A_DAY: 86400000,
    CELL_SIDE_LENGTH: Dimensions.get('window').width / 7 - 0.00001,
    BLUE_COLOR : "#1074a5",
    VERY_LIGH_GREY: "#f5f5f5"

});

export default Constants;