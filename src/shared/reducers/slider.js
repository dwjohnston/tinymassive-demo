import SLIDER_UPDATE, { GROUP_UPDATE } from "../actions/sliderChange";
const initialState = {

};


export const group = (state = {}, action) => {
    switch (action.type) {
    case GROUP_UPDATE: {
        const newState = { ...state };
        if (!newState[action.payload.groupName]) {
            newState[action.payload.groupName] = {};
        }
        newState[action.payload.groupName][action.payload.sliderName] = action.payload.value;
        return newState;
    }
    default: {
        return state;
    }
    }
};
export default (
    state = initialState,
    action
) => {
    switch (action.type) {
    case SLIDER_UPDATE: {
        const newState = { ...state };
        newState[action.payload.name] = action.payload.value;
        return newState;
    }



    default: {
        return initialState;
    }
    }
};
