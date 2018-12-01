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
        flexFlow: "row nowrap",

        "& >*": {
            border: "solid 2px black",
            padding: "10px",
            margin: "10px",
        }
    },
};

export default withStyles(styles)(
    Main
);
