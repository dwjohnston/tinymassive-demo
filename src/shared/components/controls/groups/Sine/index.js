import React, {
    Component,
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Slider from "../../../buildingBlocks/slider";
import { groupUpdate } from "../../../../actions/sliderChange";

import { connect } from 'react-redux';


class Controls extends Component {
    constructor(props) {
        super(props);
        this.state = { value: props.value };

        this.props.sliderUpdate(this.props.groupName, "color", this.props.color);
    }

    handleChange = (id, v) => {
        this.setState({
            value: v
        });
        this.props.sliderUpdate(this.props.groupName, id, v)
    }
    render() {

        const { classes, initValues } = this.props;

        const { m = 0, c = 6, amp = 1, freq = 1, speed = 0.5 } = initValues;
        return <div className={classes.root}>

            <Slider
                classes={{ root: classes.sliderRoot, container: classes.slider }}
                initialValue={m}
                onChange={this.handleChange}
                min={-0.2}
                max={0.2}
                step={0.005}
                label="m"
                id="m"
            />


            <Slider
                classes={{ root: classes.sliderRoot, container: classes.slider }}
                initialValue={c}
                onChange={this.handleChange}
                min={1}
                max={10}
                step={1}
                label="c"
                id="c"
            />

            <Slider
                classes={{ root: classes.sliderRoot, container: classes.slider }}
                initialValue={amp}
                onChange={this.handleChange}
                min={0}
                max={1}
                step={0.1}
                label="Amp"
                id="amp"
            />

            <Slider
                classes={{ root: classes.sliderRoot, container: classes.slider }}
                initialValue={freq}
                onChange={this.handleChange}
                min={0.5}
                max={4}
                step={0.1}
                label="Freq"
                id="freq"
            />

            <Slider
                classes={{ root: classes.sliderRoot, container: classes.slider }}
                initialValue={speed}
                onChange={this.handleChange}
                min={-1}
                max={1}
                step={0.1}
                label="Speed"
                id="speed"
            />

            <div style={{
                backgroundColor: this.props.color,
                width: 20,
                height: 20,
            }} />
        </div>;
    }
}


const styles = {
    root: {
        display: "flex",
        border: "dotted 2px black"
    }
};



const mapStateToProps = (
    state,
    ownProps
) => {
    return {
        value: state.slider.value,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        sliderUpdate: (groupName, n, v) => dispatch(groupUpdate(groupName, n, v))
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Controls));
