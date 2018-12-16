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
    calcAll,

} from "./calcFunctions";
import { bikerMoveAction } from '../../actions/biker';
import { moveBikerMain } from '../../actions/socket';
import { FormControlLabel, Checkbox } from '@material-ui/core';

//Size in pixels of the displays
export const HEIGHT_LEFT = 9;
export const WIDTH_LEFT = 39;

export const HEIGHT_RIGHT = 13;
export const WIDTH_RIGHT = 38;

//Size adjustment of our main display
export const N_GRID_GRAIN = 1;  //We didn't end up using this functinality
export const GRID_GRAIN_SIZE = 6;
export const MAIN_GRAIN_SIZE = 6;

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

    if (small) {
        small.fillStyle = clearColor;
        small.fillRect(0, 0, 77, 13);
    }

    grids.forEach(grid => {
        grid.fillStyle = clearColor;
        grid.fillRect(0, 0, 770, 130);
    });
}

function drawCanvasGrid(pixels, grid, yShift = 0, xShift = 0) {
    for (let pixel of pixels) {
        grid.fillStyle = pixel.color;
        grid.fillRect(
            (pixel.x + xShift) * GRID_GRAIN_SIZE,
            (pixel.y + yShift) * GRID_GRAIN_SIZE,
            GRID_GRAIN_SIZE,
            -1 * GRID_GRAIN_SIZE
        );
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
        if (prevState.displayTinyMassive != this.state.displayTinyMassive
            || prevState.displayYours != this.state.displayYours) {
            return true;
        }
        return false;
    }

    handleCheckboxChange = (e) => {
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
        let u = 0;

        function draw() {
            //Clear canvases

            const { color, sine, biker, bikerObj, updateBiker } = this.props;
            clearCanvas(null, sine, color, contextRight, contextLeft);

            const { newBikerObj, toDrawRight, bikerGrid, toDrawLeft } = calcAll(
                t,
                sine,
                color,
                biker,
                bikerObj
            );
            updateBiker(newBikerObj);

            drawCanvasGrid(toDrawRight, contextRight);
            drawCanvasGrid(
                bikerGrid,
                bikerGrid[0].x < WIDTH_LEFT ? contextLeft : contextRight,
                -1,
                bikerGrid[0].x >= WIDTH_LEFT ? WIDTH_LEFT * -1 : 0
            );
            drawCanvasGrid(toDrawLeft, contextLeft);

            t++;
            window.requestAnimationFrame(draw);
        }

        function drawMain() {
            if (this.props.socketData && this.props.socketData.sine1) {
                const { color, sine1, biker } = this.props.socketData;
                const { updateBikerMain, socketBikerObject } = this.props;
                clearCanvas(context, sine1, color, contextMainLeft, contextMainRight);
                if (sine1) {
                    const { newBikerObj, toDrawRight, bikerGrid, toDrawLeft } = calcAll(
                        u,
                        sine1,
                        color,
                        biker,
                        socketBikerObject
                    );

                    updateBikerMain(newBikerObj);

                    drawCanvasGrid(toDrawRight, contextMainRight);

                    drawCanvasGrid(
                        bikerGrid,
                        bikerGrid[0].x < WIDTH_LEFT ? contextMainLeft : contextMainRight,
                        -1,
                        bikerGrid[0].x >= WIDTH_LEFT ? WIDTH_LEFT * -1 : 0
                    );
                    drawCanvasGrid(toDrawLeft, contextMainLeft);

                }
                u++;
            }
            window.requestAnimationFrame(drawMain);
        }

        draw = draw.bind(this);
        drawMain = drawMain.bind(this);
        window.requestAnimationFrame(drawMain);
        window.requestAnimationFrame(draw);
    }

    render() {

        const { classes } = this.props;
        return <div className={classes.root}>

            <canvas width="77" height="13" ref={this.ref} className={classes.fixed} />

            <div className={classes.checkboxes}>


                <FormControlLabel
                    control={
                        <Checkbox
                            checked={this.state.displayTinyMassive}
                            onChange={this.handleCheckboxChange}
                            value="displayTinyMassive"
                            color="primary"
                        />
                    }
                    label="Display TinyMassive"
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={this.state.displayYours}
                            onChange={this.handleCheckboxChange}
                            value="displayYours"
                            color="primary"
                        />
                    }
                    label=" Display Yours"
                />
            </div>
            <div
                style={{ display: this.state.displayTinyMassive ? "block" : "none" }} >
                <h2>Tiny Massive Display</h2>

                <div className={classes.canvasContainer}
                >
                    <canvas width={WIDTH_LEFT * N_GRID_GRAIN * GRID_GRAIN_SIZE} height={HEIGHT_LEFT * N_GRID_GRAIN * GRID_GRAIN_SIZE} ref={this.refMainLeftGrid} />
                    <canvas width={WIDTH_RIGHT * N_GRID_GRAIN * GRID_GRAIN_SIZE} height={HEIGHT_RIGHT * N_GRID_GRAIN * GRID_GRAIN_SIZE} ref={this.refMainRightGrid} />
                </div>
            </div>


            <div
                style={{ display: this.state.displayYours ? "block" : "none" }}>
                <h2>Your Display</h2>

                <div className={classes.canvasContainer}
                >
                    <canvas width={WIDTH_LEFT * N_GRID_GRAIN * GRID_GRAIN_SIZE} height={HEIGHT_LEFT * N_GRID_GRAIN * GRID_GRAIN_SIZE} ref={this.refLeftGrid} />
                    <canvas width={WIDTH_RIGHT * N_GRID_GRAIN * GRID_GRAIN_SIZE} height={HEIGHT_RIGHT * N_GRID_GRAIN * GRID_GRAIN_SIZE} ref={this.refRightGrid} />
                </div>
            </div>

        </div >;
    }
}

const styles = {
    root: {
        padding: "20px 0",
        "& canvas": {
        },
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "space-around",
        // position: "fixed",
        // top: 0,
        // right: 0,
        // left: 0,

        "& h2": {
            margin: 5,
        }
    },



    checkboxes: {
        flex: "0 0 100%",
        display: "flex",
        flexFlow: "row nowrap",
    },

    fixed: {
        position: "fixed",
        left: 0,
        top: 0,
    },

    canvasContainer: {
        "&>h2": {
            flex: "0 0 fill-content"
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
        sine: state.groups.sine1,
        biker: state.groups.biker,
        bikerObj: state.biker,
        color: state.groups.color,
        socketData: state.socket.data,
        socketBikerObject: state.socketBiker,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateBiker: bikerObj => dispatch(bikerMoveAction(bikerObj)),
        updateBikerMain: bikerObj => dispatch(moveBikerMain(bikerObj))
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Canvas));
