import React, {
    Component,
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { subscribeToTimer, subscribeToStatus, disconnect, joinQueue, subscribeToTakeControl, updateOut, subscribeToReceiveUpdate } from '../../services/socket';
import { connect } from 'react-redux';
import oHash from "object-hash";
import { recieveDataAction } from '../../actions/socket';
class SocketPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: {},
            id: joinQueue(),
        };



        subscribeToTimer((err, time) => {
            this.setState({
                timeLeft: time
            });
        });
        subscribeToStatus((err, status) => {

            this.setState({
                status: status
            });
        });

        subscribeToReceiveUpdate((err, data) => {

            console.log("receive update", data);
            this.setState({
                algoState: data
            })



            this.props.updateForeign(data);
        });


        subscribeToTakeControl(() => {

            updateOut(this.props.wholeState);
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.wholeState !== this.props.wholeState && this.state.status.active) {
            updateOut(this.props.wholeState);
        }
    }

    componentWillUnmount() {
        disconnect();
    }
    render() {

        const { wholeState, classes } = this.props;
        const { status, timeLeft } = this.state;
        return <div>

            <h3> Queue Info </h3>

            <div className={classes.info}>
                <div>
                    {status.active ? "ACTIVE - YOU'RE LIVE!" : "IN QUEUE"}
                </div>

                <div> <strong> Socket ID </strong> {this.state.id}</div>
                <div>
                    <strong> Queue Position </strong>
                    {status.queuePosition}
                </div>

                <div>
                    <strong> Queue Size </strong>
                    {status.queueSize}
                </div>

                <div>
                    <strong>Time till queue jump </strong>
                    {timeLeft}
                </div>


                <div>

                    <strong>my state</strong>
                    {oHash(this.props.wholeState)}
                </div>

                <div>
                    <strong>algo state</strong>
                    {oHash(this.state.algoState || {})}
                </div>


            </div>

        </div>;
    }
}

const styles = {
    root: {},
    info: {
        display: "flex",
        flexFlow: "row wrap",
        "&>*": {
            border: "solid 1px black",
            padding: 5,

        }
    }
};



const mapStateToProps = (
    state,
    ownProps
) => {
    return {
        wholeState: state.groups,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateForeign: data => dispatch(recieveDataAction(data))
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SocketPage));
