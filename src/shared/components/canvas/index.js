import React, {
    Component,
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { randomInt } from "davids-toolbox";
import { connect } from 'react-redux';
import xolor from "xolor";

const HEIGHT = 13;
const WIDTH = 77;
const N_GRID_GRAIN = 4;
const GRID_GRAIN_SIZE = 2;

const MAIN_GRAIN_SIZE = 8;

function getDrawArray(m, c) {

    let array = [...Array(WIDTH)].map(() => Array(HEIGHT));
    for (let i = 0; i < WIDTH; i++) {
        const y = Math.floor(m * i + c);
        if (y < HEIGHT) {
            array[i][y] = true;
        }

    }
    console.log(array);
    return array;
}

function sineAdjust(t, x, amp, freq) {
    return Math.sin(((t + x) * 4 / WIDTH) * Math.PI * freq) * (amp * HEIGHT);
}

function getPixels(t, color, m, c, amp, freq) {

    let array = [];


    for (let i = 0; i < WIDTH; i++) {
        const y = Math.floor(m * i + c) + sineAdjust(t, i, amp, freq);
        if (y < HEIGHT) {
            array.push({
                x: i,
                y: y,
                color: color,
            });
        }

    }

    return array;
}

function calcForSineGrid(t, color, m, c, amp, freq) {

    let array = [];


    for (let i = 0; i < WIDTH * N_GRID_GRAIN; i++) {
        const y = Math.floor(m * N_GRID_GRAIN * i + c * N_GRID_GRAIN) + sineAdjust(t * N_GRID_GRAIN, i, amp * N_GRID_GRAIN, freq / N_GRID_GRAIN);
        array.push({
            x: i,
            y: y,
            color: color,
        });

    }

    return array;
}

function calcForModGrid(t, group, mod) {

    let array = [];
    const { m, c, amp, freq, color } = group;
    for (let i = 0; i < WIDTH * N_GRID_GRAIN; i++) {

        const adjustedSine = group.freq + group.freq * sineAdjust(i, 0, (group.modAmp / HEIGHT), group.modFreq);

        const y = Math.floor(m * N_GRID_GRAIN * i + c * N_GRID_GRAIN) + sineAdjust(group.speed * t * N_GRID_GRAIN, i, amp * N_GRID_GRAIN, adjustedSine / N_GRID_GRAIN);
        array.push({
            x: i,
            y: y,
            color: color,
        });

    }

    return array;
}


function clearCanvas(small, large, grid) {
    small.fillStyle = "rgba(0, 0, 0, 0.1)";
    large.fillStyle = "rgba(0, 0, 0, 0.1)";
    grid.fillStyle = "rgba(0, 0, 0, 0.1)";

    small.fillRect(0, 0, 77, 13);
    large.fillRect(0, 0, 770, 130);
    grid.fillRect(0, 0, 770, 130);
}

function drawCanvas(pixels, color, small, large) {

    //Draw new array
    small.fillStyle = color;
    large.fillStyle = color;
    for (let pixel of pixels) {
        small.fillRect(pixel.x, pixel.y, 2, 2);
        large.fillRect(pixel.x * MAIN_GRAIN_SIZE, pixel.y * MAIN_GRAIN_SIZE, MAIN_GRAIN_SIZE, MAIN_GRAIN_SIZE);
    }
}

function drawCanvasGrid(pixels, grid) {
    for (let pixel of pixels) {
        grid.fillStyle = pixel.color;
        grid.fillRect(pixel.x * GRID_GRAIN_SIZE, pixel.y * GRID_GRAIN_SIZE, GRID_GRAIN_SIZE, GRID_GRAIN_SIZE);
    }
}


function averageColors(str1, str2, position) {
    return xolor(str1).gradient(str2, position < 1 && position > 0 ? position : 1).toString();
}

class Canvas extends Component {
    constructor(props) {
        super(props);

        this.ref = React.createRef();
        this.refLargeLeft = React.createRef();
        this.refLargeGrid = React.createRef();

        this.state = {
        };


    }



    draw() {


    }
    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        const context = this.ref.current.getContext("2d");
        const context2 = this.refLargeLeft.current.getContext("2d");
        const context3 = this.refLargeGrid.current.getContext("2d");

        let t = 0;

        function draw() {
            //Clear canvases
            clearCanvas(context, context2, context3);

            const arrays = [];
            const arrayGrids = [];
            Object.values(this.props.groups).forEach((group, i) => {
                arrays.push(getPixels(t * group.speed, group.color, group.m, group.c, group.amp, group.freq));
                //arrayGrids.push(calcForSineGrid(t * group.speed, group.color, group.m, group.c, group.amp, group.freq));
                arrayGrids.push(calcForModGrid(t, group));

            });

            const moreArrayGrids = [];
            // for (let i = 0; i < arrayGrids[0].length; i++) {

            //     let a = arrayGrids[0][i];
            //     let b = arrayGrids[1][i];

            //     let pixels = [];
            //     [a, b] = (a.y >= b.y) ? [a, b] : [b, a];

            //     for (let j = b.y + 1; j < a.y; j++) {
            //         pixels.push({
            //             x: i,
            //             y: j,
            //             color: averageColors(a.color, b.color, (a.y - j) / a.y)
            //         })
            //     }

            //     moreArrayGrids.push(...pixels);
            // }


            const toDraw = [...arrayGrids[0], ...arrayGrids[1], ...moreArrayGrids];


            Object.values(this.props.groups).forEach((group, i) => {
                drawCanvas(arrays[i], group.color, context, context2);
            });

            drawCanvasGrid(toDraw, context3);




            t++;
            window.requestAnimationFrame(draw);
        }


        draw = draw.bind(this);
        window.requestAnimationFrame(draw);
    }



    render() {

        const { classes } = this.props;
        return <div className={classes.root}>

            <canvas width="77" height="13" ref={this.ref} className={classes.fixed} />

            <div className={classes.canvasContainer}>
                <canvas width={WIDTH * MAIN_GRAIN_SIZE} height={HEIGHT * MAIN_GRAIN_SIZE} ref={this.refLargeLeft} />
                <canvas width={WIDTH * N_GRID_GRAIN * GRID_GRAIN_SIZE} height={HEIGHT * N_GRID_GRAIN * GRID_GRAIN_SIZE} ref={this.refLargeGrid} />

            </div>

        </div>;
    }
}

const styles = {
    root: {
        padding: "20px 0",

        "& canvas": {
            border: "dashed 1px black",
        }
    },

    fixed: {
        position: "fixed",
        left: 0,
        top: 0,
    },

    canvasContainer: {
        display: "flex",
        flexFlow: "column nowrap",
    }
};



const mapStateToProps = (
    state,
    ownProps
) => {
    return {
        groups: [state.groups.sine1, state.groups.sine2],
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Canvas));
