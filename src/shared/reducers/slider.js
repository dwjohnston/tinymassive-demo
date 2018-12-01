import SLIDER_UPDATE from "../actions/sliderChange";
const initialState = {
    m: 5,
    c: 5
};

export default (
    state = initialState,
    action
) => {
    switch (action.type) {
    case "SLIDER_UPDATE": {
        const newState = { ...state };
        newState[action.payload.name] = action.payload.value;
        return newState;
    }

    default: {
        return initialState;
    }
    }
};
