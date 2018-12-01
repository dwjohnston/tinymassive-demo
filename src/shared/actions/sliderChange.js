
export const SLIDER_UPDATE = 'SLIDER_UPDATE';
export const GROUP_UPDATE = 'GROUP_UPDATE';
/**
 * This method is used to create the SLIDER_UPDATE action.
 * It is dispatched to the reducer and handled by it.
 *
 * @param name Name of the slider
 * @returns {{type: string, payload: {name: *, value: *}}} SLIDER_UPDATE action
 */
export const sliderUpdate = (name, value) => ({
    type: SLIDER_UPDATE,
    payload: {
        name: name,
        value: value,
    }
});

export const groupUpdate = (groupName, sliderName, value) => ({
    type: GROUP_UPDATE,
    payload: {
        groupName: groupName,
        sliderName: sliderName,
        value: value,
    }
});