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
    calcBiker,

} from "./calcFunctions";
import { bikerMoveAction } from '../../actions/biker';

//Size in pixels of the displays
export const HEIGHT_LEFT = 9;
export const WIDTH_LEFT = 39;

export const HEIGHT_RIGHT = 13;
export const WIDTH_RIGHT = 38;

//Size adjustment of our main display
export const N_GRID_GRAIN = 1;  //We didn't end up using this functinality
export const GRID_GRAIN_SIZE = 8;
export const MAIN_GRAIN_SIZE = 8;

//The hidden pixels on the left display. 
//There are some on the right display too - just to make it look a bit smoother
export const LEFT_PIXELS_TRUNCATE = [7, 9, 8, 8, 7];
export const RIGHT_PIXELS_TRUNCATE = [4, 6, 6, 5, 17];

export const LEFT_PIXELS_TRUNCATE_MAP = createTruncateMap(LEFT_PIXELS_TRUNCATE);
export const RIGHT_PIXELS_TRUNCATE_MAP = createTruncateMap(RIGHT_PIXELS_TRUNCATE);

function createTruncateMap(array) {
    return array.reduce((p, c, i) => {
        return [...p, ...(new Array(c).fill(array.length - 1 - i))]
    }, []);
}

function clearCanvas(small, control, color, ...grids) {
    let clearColor = "rgba(0, 0, 0, 0.01)";
    if (control) {
        if (control.speed === 0) {
            return;
        }
        let c = xolor([0, 0, 0]);
        c.a = Math.pow(Math.abs(control.speed), 1.8) / color.degrade;
        clearColor = c.css;
    }
    small.fillStyle = clearColor;
    //large.fillStyle = "rgba(0, 0, 0, 0.01)";
    small.fillRect(0, 0, 77, 13);
    grids.forEach(grid => {
        grid.fillStyle = clearColor;
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

function drawCanvasGrid(pixels, grid, yShift = 0) {
    for (let pixel of pixels) {
        grid.fillStyle = pixel.color;
        grid.fillRect(pixel.x * GRID_GRAIN_SIZE, (pixel.y + yShift) * GRID_GRAIN_SIZE, GRID_GRAIN_SIZE, -1 * GRID_GRAIN_SIZE);
    }
}


class Canvas extends Component {
    constructor(props) {
        super(props);

        this.ref = React.createRef();

        this.refMainLeftGrid = React.createRef();
        this.refMainRightGrid = React.createRef();

        this.refLeftGrid = React.createRef();
        this.refRightGrid = React.createRef();

        this.state = {
            displayYours: true,
            displayTinyMassive: true,
        };
    }

    shouldComponentUpdate(prevProps, prevState) {
        //Important
        if (prevState.displayTinyMassive != this.state.displayTinyMassive || prevState.displayYours != this.state.displayYours) {
            return true;
        }
        return false;
    }

    handleCheckboxChange = (e) => {

        console.log(e.target.value, e.target.checked);
        this.setState({
            [e.target.value]: !this.state[e.target.value]
        });
    }

    componentDidMount() {
        const context = this.ref.current.getContext("2d");

        const contextMainLeft = this.refMainLeftGrid.current.getContext("2d");
        const contextMainRight = this.refMainRightGrid.current.getContext("2d");

        const contextLeft = this.refLeftGrid.current.getContext("2d");
        const contextRight = this.refRightGrid.current.getContext("2d");

        let t = 0;

        function draw() {
            //Clear canvases

            const group = this.props.groups[0]

            const { color } = this.props;
            clearCanvas(context, group, color, contextRight, contextLeft);

            const arrays = [];

            const arrayGridLeft = [];
            const arrayGridRight = [];



            arrays.push(getPixels(t * group.speed, this.props.color, group.m, group.c, group.amp, group.freq));
            arrayGridLeft.push(...calcForModGrid(t, group, color, HEIGHT_LEFT, WIDTH_LEFT, true));
            const lastPixel = arrayGridLeft[arrayGridLeft.length - 1];
            const phaseOffset = calcPhaseOffset(lastPixel.y);
            arrayGridRight.push(...calcForModGrid(t, group, color, HEIGHT_RIGHT, WIDTH_RIGHT, false, phaseOffset));
            const bikerGrid = [];
            const bikerObj = calcBiker(t, this.props.biker, this.props.bikerObj, arrayGridRight);
            bikerGrid.push(bikerObj);
            this.props.updateBiker(bikerObj);
            const toDrawRight = [...arrayGridRight];
            const toDrawLeft = [...arrayGridLeft];

            Object.values(this.props.groups).forEach((group, i) => {
                drawCanvas(arrays[i], group.color, context);
            });

            drawCanvasGrid(toDrawRight, contextRight);
            drawCanvasGrid(bikerGrid, contextRight, -1);
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

            <div>
                <label htmlFor="displayTinyMassive"> Display TinyMassive</label>
                <input
                    type="checkbox"
                    onChange={this.handleCheckboxChange}
                    value="displayTinyMassive"
                    id="displayTinyMassive"
                    checked={this.state.displayTinyMassive}
                />

                <label htmlFor="displayYours"> Display Yours</label>
                <input
                    type="checkbox"
                    onChange={this.handleCheckboxChange}
                    value="displayYours"
                    id="displayYours"
                    checked={this.state.displayYours}
                />
            </div>
            <div
                className={classes.canvasContainer}
                style={{ display: this.state.displayTinyMassive ? "flex" : "none" }} >
                <h2>Tiny Massive Display</h2>
                <canvas width={WIDTH_LEFT * N_GRID_GRAIN * GRID_GRAIN_SIZE} height={HEIGHT_LEFT * N_GRID_GRAIN * GRID_GRAIN_SIZE} ref={this.refMainLeftGrid} />
                <canvas width={WIDTH_RIGHT * N_GRID_GRAIN * GRID_GRAIN_SIZE} height={HEIGHT_RIGHT * N_GRID_GRAIN * GRID_GRAIN_SIZE} ref={this.refMainRightGrid} />
            </div>

            <div
                className={classes.canvasContainer}
                style={{ display: this.state.displayYours ? "flex" : "none" }}>
                <h2>Your Display</h2>
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
        }
    },

    fixed: {
        position: "fixed",
        left: 0,
        top: 0,
    },

    canvasContainer: {
        "&>h2": {
            flex: "0 0 100%"
        },
        display: "flex",
        flexFlow: "row wrap",
        alignItems: "flex-end",
    }
};



const mapStateToProps = (
    state,
    ownProps
) => {
    return {
        groups: [state.groups.sine1],
        biker: state.groups.biker,
        bikerObj: state.biker,
        color: state.groups.color
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateBiker: bikerObj => dispatch(bikerMoveAction(bikerObj))
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Canvas));
