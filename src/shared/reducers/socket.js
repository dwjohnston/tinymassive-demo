import { RECEIVE_DATA, MOVE_BIKER_MAIN } from "../actions/socket";

const initialState = {
    data: {}

};

export const bikerMainReducer = (state = {
    x: 0,
    y: 0,
    dx: 1,
    dy: 0,
}
, action) => {
    switch (action.type) {
    case MOVE_BIKER_MAIN: return action.payload;
    default: return state;

    }

}

export const socketReducer = (state = initialState, action) => {

    switch (action.type) {

    case RECEIVE_DATA: {
        return {
            data: action.payload
        };
    }
    default: return state;
    }
}

