export const RECEIVE_DATA = "RECEIVE_DATA";
export const MOVE_BIKER_MAIN = "MOVE_BIKER_MAIN";
export const recieveDataAction = (data) => ({
    type: RECEIVE_DATA,
    payload: data,
});

export const moveBikerMain = (bikerObj) => ({
    type: MOVE_BIKER_MAIN,
    payload: bikerObj
})