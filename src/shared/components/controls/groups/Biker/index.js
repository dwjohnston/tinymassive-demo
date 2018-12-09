import React, {
    Component,
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Layout from '../Layout';
import Slider from "../../../buildingBlocks/slider";
import { groupUpdate } from "../../../../actions/sliderChange";

import { connect } from 'react-redux';


const PARAM_RATIO = 50;
class BikerGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    handleChange = (id, v) => {
        this.setState({
            value: v
        });
        this.props.sliderUpdate(this.props.groupName, id, v)
    }
    render() {

        const { initValues = {}, maxValues = {}, displayValues = {} } = this.props;
        const {
            speed: initSpeed = 2,
            weight: initWeight = 10,
        } = initValues;

        const {
            speed: maxSpeed = 5,
            weight: maxWeight = 20,
        } = maxValues;

        return <Layout label="Biker">

            <Slider
                initialValue={initSpeed}
                onChange={this.handleChange}
                min={maxSpeed * -1}
                max={maxSpeed}
                step={maxSpeed / PARAM_RATIO}
                label="Speed"
                id="speed"
            />

            <Slider
                initialValue={initWeight}
                onChange={this.handleChange}
                min={maxWeight / PARAM_RATIO}
                max={maxWeight}
                step={maxWeight / PARAM_RATIO}
                label="Weight"
                id="weight"
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
)(withStyles(styles)(BikerGroup));
