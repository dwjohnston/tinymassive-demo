import React from 'react';
import ReactDOM from 'react-dom/server';
import Helmet from 'react-helmet';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';

import createDocument from './document';
import App from '../shared/App';
import { SheetsRegistry } from 'jss';

import JssProvider from 'react-jss/lib/JssProvider';
import {
    MuiThemeProvider,
    createMuiTheme,
    createGenerateClassName,
} from '@material-ui/core/styles';

import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

/**
 * Provides the server side rendered app. In development environment, this method is called by
 * `react-hot-server-middleware`.
 *
 * This method renders the ejs template `public/views/index.ejs`.
 *
 * @param clientStats Parameter passed by hot server middleware
 */
export default ({ clientStats }) => async (req, res) => {


    const sheetsRegistry = new SheetsRegistry();

    // Create a sheetsManager instance.
    const sheetsManager = new Map();

    // Create a theme instance.
    const theme = createMuiTheme({
        palette: {
            primary: green,
            accent: red,
            type: 'light',
        },
    });

    const generateClassName = createGenerateClassName();


    const app = (

        <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
            <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
                <App />
            </MuiThemeProvider>
        </JssProvider>
    );

    const appString = ReactDOM.renderToString(app);
    const helmet = Helmet.renderStatic();
    const chunkNames = flushChunkNames();
    const { js, styles } = flushChunks(clientStats, { chunkNames });
    const jss = sheetsRegistry.toString();
    const document = createDocument({
        appString,
        js,
        styles,
        helmet,
        jss,

    });

    res.set('Content-Type', 'text/html').end(document);
};
