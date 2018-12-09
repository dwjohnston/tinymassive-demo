import { combineReducers } from 'redux';

import slider from "./slider";
import { group } from "./slider";
import { bikerReducer } from './biker';
export default combineReducers({

    slider: slider,
    groups: group,
    biker: bikerReducer
});
