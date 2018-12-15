import express from 'express';
import helmet from 'helmet';
import shrinkRay from 'shrink-ray';
import { join } from 'path';
import { log } from 'winston';
import http from "http";
import socketio from "socket.io";
import oHash from "object-hash";
const io = socketio();


/**
 * Configures hot reloading and assets paths for local development environment.
 * Use the `npm start` command to start the local development server.
 *
 * @param app Express app
 */
const configureDevelopment = (app) => {
    const clientConfig = require('../webpack/client');
    const serverConfig = require('../webpack/server');
    const { publicPath, path } = clientConfig.output;

    const multiCompiler = require('webpack')([clientConfig, serverConfig]);
    const clientCompiler = multiCompiler.compilers[0];

    app.use(require('webpack-dev-middleware')(multiCompiler, { publicPath }));
    app.use(require('webpack-hot-middleware')(clientCompiler));

    app.use(publicPath, express.static(path));

    app.use(require('webpack-hot-server-middleware')(multiCompiler, {
        serverRendererOptions: { outputPath: path },
    }));
};

/**
 * Configures assets paths for production environment.
 * This environment is used in deployment and inside the docker container.
 * Use the `npm run build` command to create a production build.
 *
 * @param app Express app
 */
const configureProduction = (app) => {
    const clientStats = require('./assets/stats.json');
    const serverRender = require('./assets/app.server.js').default;
    const publicPath = '/';
    const outputPath = join(__dirname, 'assets');

    app.use(publicPath, express.static(outputPath));
    app.use(serverRender({
        clientStats,
        outputPath,
    }));
};

const app = express();

const isDevelopment = process.env.NODE_ENV === 'development';

log('info', `Configuring server for environment: ${process.env.NODE_ENV}...`);
app.use(helmet());
app.use(shrinkRay({
    filter: () => !isDevelopment,
}));
app.set('port', process.env.PORT || 3000);

if (isDevelopment) {
    configureDevelopment(app);
} else {
    configureProduction(app);
}

app.listen(app.get('port'), () => log('info', `Server listening on port ${app.get('port')}...`));


let activeClient = null;
let nClients = 0;

let clients = [];

let interval = null;
let timerInterval = null;
let timeLeft = 0;

let currentState = null;


function updateStatuses() {
    console.log("update status", clients.length);

    clients.forEach((client, i) => {
        console.log(client.id, "::", i)
        if (i === 0) {
            console.log("active: ", client.id);

            client.emit("status", {
                active: true,
                queuePosition: i,
                queueSize: clients.length,
            });


            if (activeClient !== client) {
                activeClient = client;
                client.emit("take control");
                timeLeft = 30;
                interval = setTimeout(() => {
                    const c = clients.shift();
                    clients.push(c);
                    updateStatuses();
                    timeLeft = 30;

                }, 30000);
            }

        }
        else {
            client.emit("status", {
                active: false,
                queuePosition: i,
                queueSize: clients.length,

            })
        }


    });
}


timerInterval = setInterval(() => {
    io.emit("timerUpdate", timeLeft--);
}, 1000);

io.on('connection', function (socket) {
    console.log("connection", socket.id);
    let addedUser = false;

    socket.on("join queue", function () {
        console.log("join queue", socket.id);
        if (addedUser) return;
        addedUser = true;
        ++nClients;
        clients.push(socket);

        socket.emit("receive update", currentState);
        updateStatuses();

    });

    socket.on("update algo", (data) => {

        console.log("update algo", socket.id);
        if (socket === activeClient) {
            console.log("update algo - do update", oHash(data));
            this.currentState = data;
            socket.emit("receive update", data);
            socket.broadcast.emit("receive update", data);
        }
    });

    socket.on('disconnect', function () {
        console.log("disconnect", socket.id);
        if (addedUser) {
            --nClients;
            clients = clients.filter(c => c !== socket);
            updateStatuses();

        }
    });

});





io.listen(8000);
