import React, {
    Component,
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Slider from "../../../buildingBlocks/slider";
import { groupUpdate } from "../../../../actions/sliderChange";

import { connect } from 'react-redux';
import Layout from '../Layout';


const STEP_RATIO = 50;
const FREQ_RATIO = 8;
class Controls extends Component {
    constructor(props) {
        super(props);
        this.state = { value: props.value };

        this.props.sliderUpdate(this.props.groupName, "color", this.props.color);
        this.props.sliderUpdate(this.props.groupName, "inverse", this.props.inverse);
        this.props.sliderUpdate(this.props.groupName, "instructions", this.props.instructions);

    }

    handleChange = (id, v) => {
        this.setState({
            value: v
        });
        this.props.sliderUpdate(this.props.groupName, id, v)
    }
    render() {

        const {
            classes,
            initValues = {},
            displayValues = {},
            maxValues = {}
        } = this.props;

        const {
            m = 0,
            c = 6,
            amp = 1,
            freq = 1,
            speed = 0.5,
            modAmp = 0.1,
            modFreq = 3,
            addFreq = 1,
            addAmp = 0.2,
        } = initValues;
        const {
            m: mM = 0.2,
            c: mC = 10,
            amp: mAmp = 1,
            freq: mFreq = 1,
            modAmp: mModAmp = 1,
            modFreq: mModFreq = 1,
            addAmp: mAddAmp = 0.25,
            addFreq: mAddFreq = 4,
            speed: mSpeed = 0.25
        } = maxValues;
        const {
            m: displayM = false,
            c: displayC = false,
            addAmp: displayAddAmp = true,
            addFreq: displayAddFreq = true,
            amp: displayAmp = true,
            freq: displayFreq = true,
            speed: displaySpeed = true
        } = displayValues;

        return (
            <Layout label="sine">
                <div className={classes.root}>

                    {displayAmp && <Slider
                        classes={{ root: classes.sliderRoot, container: classes.slider }}
                        initialValue={amp}
                        onChange={this.handleChange}
                        min={0}
                        max={mAmp}
                        step={mAmp / STEP_RATIO}
                        label="Amp"
                        id="amp"
                    />}

                    {displayFreq && <Slider
                        classes={{ root: classes.sliderRoot, container: classes.slider }}
                        initialValue={freq}
                        onChange={this.handleChange}
                        min={mFreq / (FREQ_RATIO)}
                        max={mFreq}
                        step={mFreq / STEP_RATIO}
                        label="Freq"
                        id="freq"
                    />}


                    <div className={classes.modContainer}>

                        mod
                        {displayAmp && <Slider
                            classes={{ root: classes.sliderRoot, container: classes.slider }}
                            initialValue={modAmp}
                            onChange={this.handleChange}
                            min={0}
                            max={mModAmp}
                            step={mModAmp / STEP_RATIO}
                            label="Amp"
                            id="modAmp"
                        />}

                        {displayFreq && <Slider
                            classes={{ root: classes.sliderRoot, container: classes.slider }}
                            initialValue={modFreq}
                            onChange={this.handleChange}
                            min={mModFreq / (FREQ_RATIO * 5)}
                            max={mModFreq}
                            step={mModFreq / STEP_RATIO}
                            label="Freq"
                            id="modFreq"
                        />}

                    </div>

                    <div className={classes.modContainer}>

                        add
                        {displayAmp && <Slider
                            classes={{ root: classes.sliderRoot, container: classes.slider }}
                            initialValue={addAmp}
                            onChange={this.handleChange}
                            min={0}
                            max={mAddAmp}
                            step={mAddAmp / STEP_RATIO}
                            label="Amp"
                            id="addAmp"
                        />}

                        {displayFreq && <Slider
                            classes={{ root: classes.sliderRoot, container: classes.slider }}
                            initialValue={addFreq}
                            onChange={this.handleChange}
                            min={mAddFreq / FREQ_RATIO}
                            max={mAddFreq}
                            step={mAddFreq / STEP_RATIO}
                            label="Freq"
                            id="addFreq"
                        />}

                    </div>

                    {displaySpeed && <Slider
                        classes={{ root: classes.sliderRoot, container: classes.slider }}
                        initialValue={speed}
                        onChange={this.handleChange}
                        min={-1 * mSpeed}
                        max={mSpeed}
                        step={mSpeed / STEP_RATIO}
                        label="Speed"
                        id="speed"
                    />}

                    {this.props.color && <div style={{
                        backgroundColor: this.props.color,
                        width: 20,
                        height: 20,
                    }} />}
                </div>

            </Layout>);
    }
}


const styles = {
    root: {
        display: "flex",
        border: "dotted 2px black"
    },

    modContainer: {
        display: "flex",
        border: "solid 1px black",
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
