import React, {
    Component,
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Layout from '../Layout';
import Slider from "../../../buildingBlocks/slider";
import { groupUpdate } from "../../../../actions/sliderChange";

import { connect } from 'react-redux';


const PARAM_RATIO = 50;
class ModAmp extends Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    handleChange = (id, v) => {
        this.setState({
            [id]: v
        }, () => {
            this.props.sliderUpdate(this.props.id, this.state)
        });


    }
    render() {

        const { initValues = {}, maxValues = {}, displayValues = {}, classes, label } = this.props;
        const {
            freq: initFreq = 1,
            amp: initAmp = 1,
            value: initValue = 0.5,
        } = initValues;

        const {
            freq: maxFreq = 1.5,
            amp: maxAmp = 1,
            value: maxValue = 1
        } = maxValues;

        return (
            <div className={classes.root}>
                <h3>{label}</h3>

                <div className={classes.container}>

                    <Slider
                        initialValue={initValue}
                        onChange={this.handleChange}
                        min={maxValue / PARAM_RATIO}
                        max={maxValue}
                        step={maxValue / PARAM_RATIO}
                        label="value"
                        id="value"
                    />


                    <Slider
                        initialValue={initFreq}
                        onChange={this.handleChange}
                        min={maxFreq / PARAM_RATIO}
                        max={maxFreq}
                        step={maxFreq / PARAM_RATIO}
                        label="freq"
                        id="freq"
                    />

                    <Slider
                        initialValue={initAmp}
                        onChange={this.handleChange}
                        min={0}
                        max={maxAmp}
                        step={maxAmp / PARAM_RATIO}
                        label="amp"
                        id="amp"
                    />
                </div >

            </div>);
    }
}

const styles = {

    root: {
        border: "dotted 1px black",
        "&>h3": {
            margin: "5px auto",
            textAlign: "center",
        }
    },
    container: {
        display: "flex",
        flexFlow: "row nowrap"
    },

    modAmpContainer: {
        display: "flex",
        flexFlow: "row nowrap",
        "&>span": {
            flex: "0 0 100%",
        }
    }
};

export default (withStyles(styles)(ModAmp));
