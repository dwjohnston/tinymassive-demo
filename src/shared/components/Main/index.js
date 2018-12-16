import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Canvas from "..//canvas";
import Controls from '..//controls';
import SocketInfo from "../SocketPage";
import NoSSR from "react-no-ssr";
import { Card } from '@material-ui/core';
const Main = ({ classes }) => {
    return (
        <main className={classes.root}>

            <Card classes={{ root: classes.canvasContainer }}>
                <NoSSR> <SocketInfo /></NoSSR>
                <Canvas />
            </Card>
            <Card elevation={0} className={classes.controlsContainer}>
                <Controls />
            </Card>
        </main>
    );
};

const styles = {
    root: {
        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "stretch",
        padding: 0,

        maxWidth: 1080,
        margin: "auto",

        color: "#bbdefb",

    },

    canvasContainer: {
        backgroundColor: "#212121",
        flex: "0 0 auto",
    },

    controlsContainer: {
        overflowY: "scroll",
        flex: "1 1 auto",
    }
};

export default withStyles(styles)(
    Main
);
