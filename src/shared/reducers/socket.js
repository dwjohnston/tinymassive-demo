import { RECEIVE_DATA } from "../actions/socket";

const initialState = {
    data: null
};

export default (state = initialState, action) => {
    switch (action.type) {
    case RECEIVE_DATA: return {
        data: action.payload.data
    };
    default: return state;
    }
}

