import React, {
    Component,
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { randomInt } from "davids-toolbox";
import { connect } from 'react-redux';

class Canvas extends Component {
    constructor(props) {
        super(props);

        this.ref = React.createRef();
        this.refLargeLeft = React.createRef();
        this.refLargeRight = React.createRef();

        this.state = {
        };


    }


    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        const context = this.ref.current.getContext("2d");
        const context2 = this.refLargeLeft.current.getContext("2d");
        const context3 = this.refLargeLeft.current.getContext("2d");

        const draw = () => {

            const randA = randomInt(0, 76);
            const randB = randomInt(0, 12);

            context.fillStyle = "rgba(0, 0, 0, 0.1)";
            context2.fillStyle = "rgba(0, 0, 0, 0.1)";

            context.fillRect(0, 0, 77, 13);
            context2.fillRect(0, 0, 770, 130);
            context.fillStyle = "rgba(255, 0, 0, 1)";
            context2.fillStyle = "rgba(255, 0, 0, 1)";

            context.fillRect(randA, randB, 2, 2);
            context2.fillRect(randA * 10, randB * 10, this.props.sliders.M * 10, this.props.sliders.C * 10);
            window.requestAnimationFrame(draw);
        }

        window.requestAnimationFrame(draw);
    }



    render() {

        const { classes } = this.props;
        return <div className={classes.root}>

            <canvas width="77" height="13" ref={this.ref} className={classes.fixed} />

            <div className={classes.canvasContainer}>
                <canvas width="390" height="90" ref={this.refLargeLeft} />
                <canvas width="380" height="130" ref={this.refLargeRight} />
            </div>

        </div>;
    }
}

const styles = {
    root: {
        padding: "20px 0",
    },

    fixed: {
        position: "fixed",
        left: 0,
        top: 0,
    },

    canvasContainer: {
        display: "flex",
        flexFlow: "row wrap",
    }
};



const mapStateToProps = (
    state,
    ownProps
) => {
    return {
        sliders: state.slider
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
