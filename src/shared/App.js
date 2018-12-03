import React, { Component } from 'react';
import './app.styl';

import Helmet from 'react-helmet';

import { Typography, Card, withStyles } from '@material-ui/core';
import { Switch, Route } from 'react-router-dom';

import UniversalComponent from './components/UniversalComponent';
import { connect } from "react-redux";
import Main from './components/Main';
import SocketPage from './components/SocketPage';
/**
 * The `App` component is the entry point for the react app.
 * It is rendered on the client as well as on the server.
 *
 * This is also the entry point for react router, declare any
 * of your top-level routes here.
//  */
// @connect(mapStateToProps, {
//     addTodo
// })
class App extends Component {

    render() {

        const { classes, todos } = this.props;
        return (
            <>
                <Helmet>
                    <title>App Component | React Universal</title>
                </Helmet>

                <Switch>
                    <Route exact path="/" component={Main} />
                    <Route path="/socket" component={SocketPage} />
                </Switch>

            </>
        );
    }
}

const styles = theme => ({
    root: {

    },

})


const mapStateToProps = (
    state,
    ownProps
) => {
    return {
        sliderValue: state.slider.value
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));
