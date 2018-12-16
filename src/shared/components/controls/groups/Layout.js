import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const GroupLayout = ({ classes, label, children }) => {
    return (
        <div className={classes.root}>
            <h2>{label}</h2>

            <div className={classes.container}>
                {children}
            </div>
        </div>
    );
};

const styles = theme => ({
    root: {
        "&>h2": {
            textAlign: "center",
            margin: "5px auto",
        },

        margin: "0 10px",
        border: `solid 1px ${theme.palette.primary.main}`,
    },

    container: {
        display: "flex",
        flexFlow: "row wrap",
        alignItems: "flex-end",
    }
});


export default withStyles(styles)(
    GroupLayout
);
