import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Canvas from "..//canvas";
import Controls from '..//controls';
import SocketInfo from "../SocketPage";
import NoSSR from "react-no-ssr";
const Main = ({ classes }) => {
    return (
        <main className={classes.root}>
            <Canvas />
            <Controls />
            <NoSSR> && <SocketInfo /></NoSSR>
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
