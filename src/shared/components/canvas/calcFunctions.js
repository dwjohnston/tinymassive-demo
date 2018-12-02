import {
    HEIGHT_RIGHT,
    WIDTH_RIGHT,
    HEIGHT_LEFT,
    WIDTH_LEFT,
    N_GRID_GRAIN,
    GRID_GRAIN_SIZE,
    MAIN_GRID_SIZE,
    LEFT_PIXELS_TRUNCATE_MAP,
    RIGHT_PIXELS_TRUNCATE_MAP
} from "./index";



function calcGridLeft(t, group) {

    let pixels = calcForModGrid(t, group, HEIGHT_LEFT, WIDTH_LEFT, true);

}


export function getDrawArray(m, c) {

    let array = [...Array(WIDTH_RIGHT)].map(() => Array(HEIGHT_RIGHT));
    for (let i = 0; i < WIDTH_RIGHT; i++) {
        const y = Math.floor(m * i + c);
        if (y < HEIGHT_RIGHT) {
            array[i][y] = true;
        }

    }
    console.log(array);
    return array;
}

export function sineAdjust(t, x, amp, freq, phaseOffset = 0) {
    return Math.sin(
        (
            ((t + x) * 4 / WIDTH_RIGHT)
            * Math.PI * freq
        )
        + phaseOffset
    ) * (amp);
}

export function getPixels(t, color, m, c, amp, freq) {

    let array = [];


    for (let i = 0; i < WIDTH_RIGHT; i++) {
        const y = Math.floor(m * i + c) + sineAdjust(t, i, amp, freq);
        if (y < HEIGHT_RIGHT) {
            array.push({
                x: i,
                y: y,
                color: color,
            });
        }

    }

    return array;
}

export function calcForSineGrid(t, color, m, c, amp, freq) {

    let array = [];


    for (let i = 0; i < WIDTH_RIGHT * N_GRID_GRAIN; i++) {
        const y = Math.floor(m * N_GRID_GRAIN * i + c * N_GRID_GRAIN) + sineAdjust(t * N_GRID_GRAIN, i, amp * N_GRID_GRAIN, freq / N_GRID_GRAIN);
        array.push({
            x: i,
            y: y,
            color: color,
        });

    }

    return array;
}

function adjustAmp(x, amp, height) {
    return (amp * N_GRID_GRAIN * height) / 2;
}
export function calcForModGridOld(
    t,
    group,
    height = HEIGHT_RIGHT,
    width = WIDTH_RIGHT,
    isLeft = false,
) {

    let array = [];
    const { m, c, amp, freq, color, inverse } = group;
    for (let i = 0; i < (inverse ? height : width) * N_GRID_GRAIN; i++) {

        const adjustedSine = freq +
            group.freq * sineAdjust(
                i,
                0,//group.speed * t * N_GRID_GRAIN,
                (group.modAmp),
                group.modFreq / N_GRID_GRAIN
            );

        const y = Math.floor(m * N_GRID_GRAIN * i + c * N_GRID_GRAIN)
            + sineAdjust(
                group.speed * t * N_GRID_GRAIN,
                i,
                adjustAmp(i, amp, height, isLeft),
                adjustedSine / N_GRID_GRAIN);

        if (inverse) {
            array.push({
                x: y,
                y: i,
                color: color,
                instructions: group.instructions,
            })
        }
        else {
            array.push({
                x: i,
                y: y,
                color: color,
                instructions: group.instructions,

            });
        }


    }

    return array;
}

export function calcPhaseOffset(y) {

    if (y === 0) console.log("zero");

    return Math.sin(((y) / (HEIGHT_LEFT - 1)) * Math.PI) + Math.PI;
}

export function calcForModGrid(
    t,
    group,
    height = HEIGHT_RIGHT,
    width = WIDTH_RIGHT,
    isLeft = false,
    phaseOffset = 0,
) {

    let array = [];
    const { addAmp, addFreq, modAmp, modFreq, amp, freq, color, inverse } = group;


    for (let i = 0; i < (inverse ? height : width) * N_GRID_GRAIN; i++) {

        let adjustedHeight = height;
        if (isLeft) {
            adjustedHeight = height - LEFT_PIXELS_TRUNCATE_MAP[i];
        }
        else {
            adjustedHeight = height - RIGHT_PIXELS_TRUNCATE_MAP[i];
        }
        const adjustedSine = freq +
            group.freq * sineAdjust(
                i,
                0, //group.speed * t * N_GRID_GRAIN,
                (modAmp),
                modFreq / N_GRID_GRAIN,
                //phaseOffset
            );



        let base = 0.5 * adjustedHeight;
        if (!isLeft) {
            //Shift the base down
            base = base + RIGHT_PIXELS_TRUNCATE_MAP[i];
        }

        const add = sineAdjust(
            0,
            //group.speed * t * N_GRID_GRAIN,
            i,
            adjustAmp(i, addAmp, adjustedHeight),
            addFreq / N_GRID_GRAIN,
            //0
            //phaseOffset
        );
        const fm = sineAdjust(
            group.speed * t * N_GRID_GRAIN,
            i,
            adjustAmp(i, amp, adjustedHeight),
            adjustedSine / N_GRID_GRAIN,
            //phaseOffset
        );

        const y = Math.ceil(
            base + add + fm
        );

        if (inverse) {
            array.push({
                x: y,
                y: i,
                color: color,
                instructions: group.instructions,
            })
        }
        else {
            array.push({
                x: i,
                y: y,
                color: color,
                instructions: group.instructions,

            });
        }


    }

    return array;
}