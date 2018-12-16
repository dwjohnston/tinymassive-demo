export const DO_RANDOM = "DO_RANDOM";
export const doRandom = () => ({
    type: DO_RANDOM,
    payload: Math.random(),
})