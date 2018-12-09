import React, {
    Component,
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Layout from '../Layout';
import Slider from "../../../buildingBlocks/slider";
import { groupUpdate } from "../../../../actions/sliderChange";

import { connect } from 'react-redux';
import ModAmp from '../ModAmp';


const PARAM_RATIO = 50;
class ColorGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    handleChange = (id, v) => {
        this.setState({
            [id]: v
        });
        this.props.sliderUpdate(this.props.groupName, id, v)
    }
    render() {

        const { initValues = {}, maxValues = {}, displayValues = {} } = this.props;
        const {
            degrade: initDegrade = 2,
        } = initValues;

        const {
            degrade: maxDegrade = 5,
        } = maxValues;

        return <Layout label="Color">

            <Slider
                initialValue={initDegrade}
                onChange={this.handleChange}
                min={maxDegrade / PARAM_RATIO}
                max={maxDegrade}
                step={maxDegrade / PARAM_RATIO}
                label="Degrade Rate"
                id="degrade"
            />


            <ModAmp
                label="R"
                id="r"
                sliderUpdate={this.handleChange}
                maxValues={{
                    value: 255,
                }}
                initValues={{
                    value: 255,
                    amp: 0

                }}

            />

            <ModAmp
                label="G"
                id="b"
                sliderUpdate={this.handleChange}
                maxValues={{
                    value: 255,
                }}
                initValues={{
                    value: 0,
                    amp: 0
                }}

            />

            <ModAmp
                label="B"
                id="g"
                sliderUpdate={this.handleChange}
                maxValues={{
                    value: 255,
                }}
                initValues={{
                    value: 0,
                    amp: 0

                }}


            />

            <ModAmp
                label="A"
                id="a"
                sliderUpdate={this.handleChange}

            />



        </Layout>;
    }
}

const styles = {
    root: {},
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
)(withStyles(styles)(ColorGroup));
