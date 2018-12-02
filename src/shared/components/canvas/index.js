import React, {
    Component,
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { randomInt } from "davids-toolbox";
import { connect } from 'react-redux';
import xolor from "xolor";
import {
    calcForModGrid,
    getPixels,
    calcPhaseOffset,

} from "./calcFunctions";

export const HEIGHT_LEFT = 9;
export const WIDTH_LEFT = 39;

export const HEIGHT_RIGHT = 13;
export const WIDTH_RIGHT = 38;

export const N_GRID_GRAIN = 1;
export const GRID_GRAIN_SIZE = 8;

export const MAIN_GRAIN_SIZE = 8;

//export const LEFT_PIXELS_TRUNCATE = [5, 6, 6, 5];
export const LEFT_PIXELS_TRUNCATE = [7, 9, 8, 8, 7];
export const RIGHT_PIXELS_TRUNCATE = [2, 2, 4, 5, 25];

export const LEFT_PIXELS_TRUNCATE_MAP = createTruncateMap(LEFT_PIXELS_TRUNCATE);
export const RIGHT_PIXELS_TRUNCATE_MAP = createTruncateMap(RIGHT_PIXELS_TRUNCATE);

function createTruncateMap(array) {
    return array.reduce((p, c, i) => {

        return [...p, ...(new Array(c).fill(array.length - 1 - i))]
    }, []);
}

console.log(LEFT_PIXELS_TRUNCATE_MAP);



function clearCanvas(small, ...grids) {
    small.fillStyle = "rgba(0, 0, 0, 0.01)";
    //large.fillStyle = "rgba(0, 0, 0, 0.01)";
    small.fillRect(0, 0, 77, 13);


    grids.forEach(grid => {
        grid.fillStyle = "rgba(0, 0, 0, 0.01)";
        grid.fillRect(0, 0, 770, 130);
    });
    //large.fillRect(0, 0, 770, 130);
}

function drawCanvas(pixels, color, small, large) {

    //Draw new array
    small.fillStyle = color;
    //large.fillStyle = color;
    for (let pixel of pixels) {
        small.fillRect(pixel.x, pixel.y, 2, 2);
        //large.fillRect(pixel.x * MAIN_GRAIN_SIZE, pixel.y * MAIN_GRAIN_SIZE, MAIN_GRAIN_SIZE, MAIN_GRAIN_SIZE);
    }
}

function drawCanvasGrid(pixels, grid) {
    for (let pixel of pixels) {
        grid.fillStyle = pixel.color;
        grid.fillRect(pixel.x * GRID_GRAIN_SIZE, pixel.y * GRID_GRAIN_SIZE, GRID_GRAIN_SIZE, -1 * GRID_GRAIN_SIZE);
        switch (pixel.instructions) {
            case "DRAW_DOWN": {

                let gradient = grid.createLinearGradient(pixel.x * GRID_GRAIN_SIZE, pixel.y * GRID_GRAIN_SIZE, (pixel.x + 1) * GRID_GRAIN_SIZE, HEIGHT_RIGHT * GRID_GRAIN_SIZE);
                let color = xolor(pixel.color);
                color.a = 0.01;
                gradient.addColorStop(0, color.toString());
                gradient.addColorStop(1, "rgba(0, 0, 0, 0.01)");
                grid.fillStyle = gradient;
                grid.fillRect(pixel.x * GRID_GRAIN_SIZE, pixel.y * GRID_GRAIN_SIZE, GRID_GRAIN_SIZE, (HEIGHT_RIGHT - pixel.y) * GRID_GRAIN_SIZE);

                break;
            }

            case "DRAW_UP": {
                let gradient = grid.createLinearGradient(pixel.x * GRID_GRAIN_SIZE, pixel.y * GRID_GRAIN_SIZE, (pixel.x + 1) * GRID_GRAIN_SIZE, 0);
                gradient.addColorStop(0, pixel.color);
                gradient.addColorStop(1, "rgba(0, 0, 0, 0.01)");
                grid.fillStyle = gradient;
                grid.fillRect(pixel.x * GRID_GRAIN_SIZE, pixel.y * GRID_GRAIN_SIZE, GRID_GRAIN_SIZE, -1 * pixel.y * GRID_GRAIN_SIZE);
                break;
            }

            case "DRAW_RIGHT": {

                let gradient = grid.createLinearGradient(pixel.x * GRID_GRAIN_SIZE, pixel.y * GRID_GRAIN_SIZE, 0, pixel.y + 1 * GRID_GRAIN_SIZE);
                gradient.addColorStop(0, pixel.color);
                gradient.addColorStop(1, "rgba(0, 0, 0, 0.01)");
                grid.fillStyle = gradient;
                grid.fillRect(pixel.x * GRID_GRAIN_SIZE, pixel.y * GRID_GRAIN_SIZE, -1 * (pixel.x) * GRID_GRAIN_SIZE, GRID_GRAIN_SIZE);

                break;
            }

            default: {
                break;
            }
        }
    }
}


function averageColors(str1, str2, position) {
    return xolor(str1).gradient(str2, position < 1 && position > 0 ? position : 1).toString();
}

class Canvas extends Component {
    constructor(props) {
        super(props);

        this.ref = React.createRef();
        //this.refLargeLeft = React.createRef();


        this.refLeftGrid = React.createRef();
        this.refRightGrid = React.createRef();

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
        //const context2 = this.refLargeLeft.current.getContext("2d");
        const contextLeft = this.refLeftGrid.current.getContext("2d");
        const contextRight = this.refRightGrid.current.getContext("2d");

        let t = 0;

        function draw() {
            //Clear canvases
            clearCanvas(context, contextRight, contextLeft);

            const arrays = [];

            const arrayGridsLeft = [];
            const arrayGridsRight = [];
            Object.values(this.props.groups).forEach((group, i) => {


                arrays.push(getPixels(t * group.speed, group.color, group.m, group.c, group.amp, group.freq));
                //arrayGrids.push(calcForSineGrid(t * group.speed, group.color, group.m, group.c, group.amp, group.freq));

                arrayGridsLeft.push(calcForModGrid(t, group, HEIGHT_LEFT, WIDTH_LEFT, true));
                const lastPixel = arrayGridsLeft[i][arrayGridsLeft.length - 1];

                const phaseOffset = calcPhaseOffset(lastPixel.y);
                arrayGridsRight.push(calcForModGrid(t, group, HEIGHT_RIGHT, WIDTH_RIGHT, false, phaseOffset));



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


            const toDrawRight = [...arrayGridsRight[0], ...arrayGridsRight[1], ...moreArrayGrids];
            const toDrawLeft = [...arrayGridsLeft[0]];



            Object.values(this.props.groups).forEach((group, i) => {
                drawCanvas(arrays[i], group.color, context);
            });

            drawCanvasGrid(toDrawRight, contextRight);

            drawCanvasGrid(toDrawLeft, contextLeft);




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
                <canvas width={WIDTH_LEFT * N_GRID_GRAIN * GRID_GRAIN_SIZE} height={HEIGHT_LEFT * N_GRID_GRAIN * GRID_GRAIN_SIZE} ref={this.refLeftGrid} />
                <canvas width={WIDTH_RIGHT * N_GRID_GRAIN * GRID_GRAIN_SIZE} height={HEIGHT_RIGHT * N_GRID_GRAIN * GRID_GRAIN_SIZE} ref={this.refRightGrid} />
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
        flexFlow: "row nowrap",
        alignItems: "flex-end",
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
