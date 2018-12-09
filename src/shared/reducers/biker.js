import { BIKER_MOVE_ACTION } from "../actions/biker";

const initialState = {
    x: 0,
    y: 0,
    dx: 1,
    dy: 0,
}


export function bikerReducer(state = initialState, action) {


    switch (action.type) {
    case BIKER_MOVE_ACTION: {
        return action.payload;
    }
    default: return state;
    }
}