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

import xolor from "xolor";

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


export function getColor(t, i, color) {

    let c = xolor([
        color.r.value * ((1 - color.r.amp) + sineAdjust(t, i, color.r.amp, color.r.freq)),
        color.g.value * ((1 - color.g.amp) + sineAdjust(t, i, color.g.amp, color.g.freq)),
        color.b.value * ((1 - color.b.amp) + sineAdjust(t, i, color.b.amp, color.b.freq))
    ])
    c.a = color.a.value * ((1 - color.a.amp) + sineAdjust(t, i, color.a.amp, color.a.freq));
    return c.css;
}

export function getPixels(t, color, m, c, amp, freq) {

    let array = [];
    for (let i = 0; i < WIDTH_RIGHT; i++) {
        const y = Math.floor(m * i + c) + sineAdjust(t, i, amp, freq);
        if (y < HEIGHT_RIGHT) {
            array.push({
                x: i,
                y: y,
                color: getColor(t, i, color),
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
                adjustedSine / N_GRID_GRAIN
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


export function calcAll(t, sine, color, biker, bikerObj) {
    const toDrawLeft = calcForModGrid(t, sine, color, HEIGHT_LEFT, WIDTH_LEFT, true);
    const lastPixel = toDrawLeft[toDrawLeft.length - 1];
    const phaseOffset = calcPhaseOffset(lastPixel.y);
    const toDrawRight = calcForModGrid(t, sine, color, HEIGHT_RIGHT, WIDTH_RIGHT, false, phaseOffset);
    const bikerGrid = [];
    const newBikerObj = calcBiker(t, biker, bikerObj, toDrawLeft, toDrawRight);
    bikerGrid.push(bikerObj);

    return {
        bikerGrid,
        toDrawLeft,
        toDrawRight,
        newBikerObj,
    }
}

export function calcPhaseOffset(y) {
    return Math.sin(((y) / (HEIGHT_LEFT - 1)) * Math.PI) + Math.PI;
}

export function calcBiker(t, bikerGroup, bikerObj, gridLeft, gridRight) {
    const xPos = bikerObj.x;

    let grid = [...gridLeft, ...gridRight];

    const gridA = grid[(Math.floor(xPos + WIDTH_RIGHT + WIDTH_LEFT) + 1) % (WIDTH_RIGHT + WIDTH_LEFT)];
    const gridB = grid[Math.floor(xPos + WIDTH_RIGHT + WIDTH_LEFT) % (WIDTH_RIGHT + WIDTH_LEFT)];
    const vector = (gridA.y - gridB.y) / 1;

    let dx, dy, y, color;
    if (bikerObj.y < gridB.y || bikerObj.vector > vector) {
        dx = bikerObj.dx;
        dy = bikerObj.dy - bikerGroup.weight;
        color = "rgba(200, 255, 200, 1)"
    }
    else {
        const angle = Math.atan(vector);
        dy = Math.abs(Math.sin(angle) * bikerGroup.speed);
        dx = Math.cos(angle) * bikerGroup.speed;

        y = gridB.y;
        color = "rgba(200, 200, 255, 1)"
    }

    return {

        x: ((bikerObj.x + dx + WIDTH_RIGHT + WIDTH_LEFT) % (WIDTH_RIGHT + WIDTH_LEFT)),
        y: (y || bikerObj.y - dy),
        dx: dx,
        dy: dy,
        color: color,
        vector: vector,
    }
}

export function calcForModGrid(
    t,
    group,
    color,
    height = HEIGHT_RIGHT,
    width = WIDTH_RIGHT,
    isLeft = false,
    phaseOffset = 0,
) {

    let array = [];
    const { addAmp, addFreq, modAmp, modFreq, amp, freq, inverse } = group;

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
                //0, 
                group.speed * t * N_GRID_GRAIN,
                (modAmp),
                modFreq / N_GRID_GRAIN,
                phaseOffset
            );



        let base = 0.5 * adjustedHeight;
        if (!isLeft) {
            //Shift the base down
            base = base + RIGHT_PIXELS_TRUNCATE_MAP[i];
        }

        const add = sineAdjust(
            //0,
            group.speed * t * N_GRID_GRAIN,
            i,
            adjustAmp(i, addAmp, adjustedHeight),
            addFreq / N_GRID_GRAIN,
            //0
            phaseOffset
        );
        const fm = sineAdjust(
            group.speed * t * N_GRID_GRAIN,
            i,
            adjustAmp(i, amp, adjustedHeight),
            adjustedSine / N_GRID_GRAIN,
            phaseOffset
        );

        const y = Math.ceil(
            base + add + fm
        );

        if (inverse) {
            array.push({
                x: y,
                y: i,
                color: getColor(t, i, color),
                instructions: group.instructions,
            })
        }
        else {
            array.push({
                x: i,
                y: y,
                color: getColor(t, i, color),
                instructions: group.instructions,
            });
        }
    }
    return array;
}