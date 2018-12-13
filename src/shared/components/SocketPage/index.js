import React, {
    Component,
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { subscribeToTimer, subscribeToStatus, disconnect, joinQueue, subscribeToTakeControl, updateOut, subscribeToReceiveUpdate } from '../../services/socket';
import { connect } from 'react-redux';

class SocketPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: {}
        };

        joinQueue();


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
            this.setState({
                algoState: data
            })
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

        const { wholeState } = this.props;
        const { status, timeLeft } = this.state;
        return <div>

            <h3> Queue Info </h3>

            <div>
                <div>
                    {status.active ? "ACTIVE - YOU'RE LIVE!" : "IN QUEUE"}
                </div>
                <div>
                    <strong> Queue Position </strong>
                    {status.queuePosition}
                </div>

                <div>
                    <strong>Time till queue jump </strong>
                    {timeLeft}
                </div>


                <div>

                    my state
                    {JSON.stringify(wholeState)}
                </div>

                <div>
                    algo state
                    {JSON.stringify(this.state.algoState)}
                </div>


            </div>

        </div>;
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
        wholeState: state.groups,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SocketPage));
