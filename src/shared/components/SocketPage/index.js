import React, {
    Component,
} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { subscribeToTimer } from '../../services/socket';

class SocketPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        subscribeToTimer((err, timestamp) => {
            console.log(err, timestamp);
            this.setState({
                ts: timestamp
            });
        })
    }
    render() {
        return <div>
            socket page

            {this.state.ts}
        </div>;
    }
}

const styles = {
    root: {},
};

export default withStyles(styles)(SocketPage);
