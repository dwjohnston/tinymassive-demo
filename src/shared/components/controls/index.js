import React, {
    Component,
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Slider from "../buildingBlocks/slider";


import { connect } from 'react-redux';
import { sliderUpdate } from '../../actions/sliderChange';


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

            <Slider
                classes={{ root: classes.sliderRoot, container: classes.slider }}
                initialValue={this.state.value}
                onChange={this.handleChange}
                min={1}
                max={10}
                step={1}
                label="M"
                id="M"
            />


            <Slider
                classes={{ root: classes.sliderRoot, container: classes.slider }}
                initialValue={this.state.value}
                onChange={this.handleChange}
                min={1}
                max={10}
                step={1}
                label="C"
                id="C"
            />
        </div>;
    }
}


const styles = {
    root: {
        display: "flex",
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
