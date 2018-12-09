import React, {
    Component,
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiSlider from '@material-ui/lab/Slider';
import { Typography } from '@material-ui/core';

import PropTypes from 'prop-types';
import { round } from "davids-toolbox";
class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = { value: props.initialValue };

        props.onChange(props.id, props.initialValue);
    }

    handleChange = (e, v) => {
        this.setState({
            value: v
        });
        this.props.onChange(this.props.id, v)
    }

    render() {
        const { classes, min, max, step, label, id } = this.props;
        return <div className={classes.root}> <div className={classes.sliderWrapper}>  <MuiSlider
            classes={{ root: classes.sliderRoot, container: classes.slider }}
            vertical
            value={this.state.value}
            onChange={this.handleChange}
            min={min}
            max={max}
            step={step}
            aria-labelledby={`label-${id}`}
        />
        </div>
        <Typography id={`value-${id}`}>{Number.parseFloat(this.state.value).toPrecision(3)}</Typography>
        <Typography id={`label-${id}`}>{label}</Typography>

        </div >;
    }
}


Slider.propTypes = {
    classes: PropTypes.object,
    initialValue: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    label: PropTypes.string,
    id: PropTypes.string,
    onChange: PropTypes.func
};
const styles = {

    root: {
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "center",

    },
    sliderWrapper: {
        display: 'flex',
        height: "100%",
        margin: 10,
    },
    slider: {
        padding: '0px 22px',
    },

    sliderRoot: {
        width: "auto",
    }
};




export default withStyles(styles)(Slider);
