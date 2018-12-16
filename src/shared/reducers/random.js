import { DO_RANDOM } from "../actions/random";

export default (state = {}, action) => {
    switch (action.type) {
    case DO_RANDOM: return action.payload
    default: return state;
    }
}