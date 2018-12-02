import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Canvas from "..//canvas";
import Controls from '..//controls';

const Main = ({ classes }) => {
    return (
        <main className={classes.root}>
            <Canvas />
            <Controls />
        </main>
    );
};

const styles = {
    root: {
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch",

    },
};

export default withStyles(styles)(
    Main
);
