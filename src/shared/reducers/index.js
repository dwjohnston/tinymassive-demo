import { combineReducers } from 'redux';

import slider from "./slider";
import { group } from "./slider";
export default combineReducers({

    slider: slider,
    groups: group,
});
