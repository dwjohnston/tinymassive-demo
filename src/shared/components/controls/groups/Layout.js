import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const GroupLayout = ({ classes, label, children }) => {
    return (
        <div className={classes.root}>
            <h2>{label}</h2>

            {children}
        </div>
    );
};

const styles = {
    root: {
        display: "flex",
        border: "dotted 2px black"
    },

    modContainer: {
        display: "flex",
        border: "solid 1px black",
    }
};


export default withStyles(styles)(
    GroupLayout
);
