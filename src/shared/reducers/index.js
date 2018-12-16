import { combineReducers } from 'redux';

import slider from "./slider";
import { group } from "./slider";
import { bikerReducer } from './biker';
import { socketReducer, bikerMainReducer } from "./socket";
import random from "./random";
export default combineReducers({
    slider: slider,
    groups: group,
    biker: bikerReducer,
    socket: socketReducer,
    socketBiker: bikerMainReducer,
    random
});
