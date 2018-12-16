import React, {
    Component,
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Slider from "../buildingBlocks/slider";


import { connect } from 'react-redux';
import { sliderUpdate } from '../../actions/sliderChange';
import Sine from './groups/Sine';
import Biker from './groups/Biker';
import { subscribeToTimer } from '../../services/socket';
import Color from './groups/Color';
import { FormControlLabel, Checkbox, Button } from '@material-ui/core';
import { doRandom } from '../../actions/random';



class Controls extends Component {
    constructor(props) {
        super(props);
        this.state = { value: props.value, doRandom: true };
        this.interval = window.setInterval(() => {
            this.props.doRandom()
        }, 30000);
    }


    handleCheckboxChange = (e) => {
        this.setState({
            [e.target.value]: !this.state[e.target.value]
        }, () => {
            if (!this.state.doRandom && this.interval) {
                window.clearInterval(this.interval);
            }

            else if (this.state.doRandom) {
                this.interval = window.setInterval(() => {
                    this.props.doRandom()
                }, 30000);
            }
        });


    }

    handleChange = (id, v) => {
        this.setState({
            value: v
        });



        this.props.sliderUpdate(id, v)
    }
    render() {

        const { classes } = this.props;
        return <div className={classes.root}>
            {this.state.ts}
            <Sine

                groupName="sine1"
                color="rgba(200, 0, 0, 0.2)"
                initValues={{
                    speed: 0.1,
                    freq: 1.3,
                    amp: 1,
                    modAmp: 0,
                    addAmp: 0,

                    modFreq: 3,
                    addFreq: 1,
                }}

                maxValues={{
                    modAmp: 0.3,
                    addAmp: 1,

                    modFreq: 0.5,
                    addFreq: 2,
                }}

            />

            <div className={classes.randomBox}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={this.state.doRandom}
                            onChange={this.handleCheckboxChange}
                            value="doRandom"
                            color="primary"
                        />
                    }
                    label="Random every 30 seconds"
                />


                <Button color="primary" onClick={this.props.doRandom} variant="contained">
                    Random now!
                </Button>


            </div>

            <Biker groupName="biker"
                initValues={{
                    weight: 0.05,
                    speed: 0.05,
                }}

                maxValues={{
                    speed: 0.5,
                    weight: 0.05,
                }}

            />

            <Color groupName="color"
                maxValues={{
                    degrade: 5
                }}
            />




        </div>;
    }
}


const styles = {
    root: {
        display: "flex",
        flexFlow: "row wrap",
        alignItems: "flex-end",
    },
    randomBox: {
        display: "flex",
        flexFlow: "column nowrap",
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
        sliderUpdate: (n, v) => dispatch(sliderUpdate(n, v)),

        doRandom: () => dispatch(doRandom())
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Controls));
