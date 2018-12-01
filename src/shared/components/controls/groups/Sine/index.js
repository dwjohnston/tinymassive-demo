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

        const { classes, initValues = {}, displayValues = {} } = this.props;

        const { m = 0, c = 6, amp = 1, freq = 1, speed = 0.5, modAmp = 0.1, modFreq = 3 } = initValues;
        const { m: displayM = true, c: displayC = true, amp: displayAmp = true, freq: displayFreq = true, speed: displaySpeed = true } = displayValues;

        return (
            <div > <h2> {this.props.groupName}</h2>
                <div className={classes.root}>


                    {displayM && <Slider
                        classes={{ root: classes.sliderRoot, container: classes.slider }}
                        initialValue={m}
                        onChange={this.handleChange}
                        min={-0.2}
                        max={0.2}
                        step={0.005}
                        label="m"
                        id="m"
                    />}


                    {displayC && <Slider
                        classes={{ root: classes.sliderRoot, container: classes.slider }}
                        initialValue={c}
                        onChange={this.handleChange}
                        min={1}
                        max={10}
                        step={1}
                        label="c"
                        id="c"
                    />}

                    {displayAmp && <Slider
                        classes={{ root: classes.sliderRoot, container: classes.slider }}
                        initialValue={amp}
                        onChange={this.handleChange}
                        min={0}
                        max={1}
                        step={0.1}
                        label="Amp"
                        id="amp"
                    />}

                    {displayFreq && <Slider
                        classes={{ root: classes.sliderRoot, container: classes.slider }}
                        initialValue={freq}
                        onChange={this.handleChange}
                        min={0.5}
                        max={4}
                        step={0.1}
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
                            max={0.5}
                            step={0.001}
                            label="Amp"
                            id="modAmp"
                        />}

                        {displayFreq && <Slider
                            classes={{ root: classes.sliderRoot, container: classes.slider }}
                            initialValue={modFreq}
                            onChange={this.handleChange}
                            min={0.1}
                            max={2}
                            step={0.01}
                            label="Freq"
                            id="modFreq"
                        />}

                    </div>

                    {displaySpeed && <Slider
                        classes={{ root: classes.sliderRoot, container: classes.slider }}
                        initialValue={speed}
                        onChange={this.handleChange}
                        min={-0.5}
                        max={0.5}
                        step={0.005}
                        label="Speed"
                        id="speed"
                    />}

                    {this.props.color && <div style={{
                        backgroundColor: this.props.color,
                        width: 20,
                        height: 20,
                    }} />}
                </div>

            </div>);
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
