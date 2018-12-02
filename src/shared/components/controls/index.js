import React, {
    Component,
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Slider from "../buildingBlocks/slider";


import { connect } from 'react-redux';
import { sliderUpdate } from '../../actions/sliderChange';
import Sine from './groups/Sine';
import Biker from './groups/Biker';


class Controls extends Component {
    constructor(props) {
        super(props);
        this.state = { value: props.value };
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
            <Sine
                groupName="sine1"
                color="rgba(200, 0, 0, 0.2)"
                initValues={{
                    speed: 0.1,
                    freq: 1.3,
                    amp: 1,
                    modAmp: 0,
                    addAmp: 0,

                    modFreq: 1,
                    addFreq: 1,
                }}

                maxValues={{
                    modAmp: 0.1,
                    addAmp: 1,

                    modFreq: 6,
                    addFreq: 4,
                }}

            />

            <Biker groupName="biker" />

            {/* <Sine
                groupName="sine2"
                color="rgba(0, 200, 0, 0.2)"
                inverse={true}
                initValues={{
                    speed: -0.1,
                    freq: 1,
                    c: 40,
                    modFreq: 0.3,
                    modAmp: 0,
                    amp: 0.4,
                }}
                maxValues={{
                    c: 77,
                    freq: 5,
                    modAmp: 3,

                }}

            /> */}

        </div>;
    }
}


const styles = {
    root: {
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
        sliderUpdate: (n, v) => dispatch(sliderUpdate(n, v))
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Controls));
