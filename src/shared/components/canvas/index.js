import React, {
    Component,
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { randomInt } from "davids-toolbox";
import { connect } from 'react-redux';


const HEIGHT = 13;
const WIDTH = 77;
const N_GRID_GRAIN = 8;
const GRID_GRAIN_SIZE = 1;

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

function getPixels(t, m, c, amp, freq) {

    let array = [];


    for (let i = 0; i < WIDTH; i++) {
        const y = Math.floor(m * i + c) + sineAdjust(t, i, amp, freq);
        if (y < HEIGHT) {
            array.push({
                x: i,
                y: y,
            });
        }

    }

    return array;
}

function getPixelsGrid(t, m, c, amp, freq) {

    let array = [];


    for (let i = 0; i < WIDTH * N_GRID_GRAIN; i++) {
        const y = Math.floor(m * N_GRID_GRAIN * i + c * N_GRID_GRAIN) + sineAdjust(t * N_GRID_GRAIN, i, amp * N_GRID_GRAIN, freq / N_GRID_GRAIN);
        if (y < HEIGHT * N_GRID_GRAIN) {
            array.push({
                x: i,
                y: y,
            });
        }

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

function drawCanvasGrid(pixels, color, grid) {

    grid.fillStyle = color;

    for (let pixel of pixels) {
        grid.fillRect(pixel.x * GRID_GRAIN_SIZE, pixel.y * GRID_GRAIN_SIZE, GRID_GRAIN_SIZE, GRID_GRAIN_SIZE);
    }
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


    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        const context = this.ref.current.getContext("2d");
        const context2 = this.refLargeLeft.current.getContext("2d");
        const context3 = this.refLargeGrid.current.getContext("2d");

        let t = 0;

        const draw = () => {
            //Clear canvases
            clearCanvas(context, context2, context3);

            Object.values(this.props.groups).forEach(group => {
                const array = getPixels(t * group.speed, group.m, group.c, group.amp, group.freq);
                const arrayGrid = getPixelsGrid(t * group.speed, group.m, group.c, group.amp, group.freq);

            });

            Object.values(this.props.groups).forEach(group => {
                drawCanvas(array, group.color, context, context2);
                drawCanvasGrid(arrayGrid, group.color, context3);
            });



            t++;
            window.requestAnimationFrame(draw);
        }

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
        groups: state.groups
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
