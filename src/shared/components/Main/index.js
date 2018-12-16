import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Canvas from "..//canvas";
import Controls from '..//controls';
import SocketInfo from "../SocketPage";
import NoSSR from "react-no-ssr";
const Main = ({ classes }) => {
    return (
        <main className={classes.root}>

            <div className={classes.canvasContainer}>
                <NoSSR> <SocketInfo /></NoSSR>
                <Canvas />
            </div>
            <div className={classes.controlContainer}>
                <Controls />
            </div>
        </main>
    );
};

const styles = {
    root: {
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch",
        padding: 15,

        maxWidth: 1080,
        margin: "auto",

    },

    controlsContainer: {
        overflowY: "scroll",
        flex: "1 0 auto",
    }
};

export default withStyles(styles)(
    Main
);
