import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

export function subscribeToTimer(cb) {
    socket.on('timerUpdate', timestamp => cb(null, timestamp));
}

export function subscribeToStatus(cb) {
    socket.on('status', status => cb(null, status));
}

export function subscribeToTakeControl(cb) {
    socket.on("take control", () => cb());
}

export function subscribeToReceiveUpdate(cb) {
    socket.on("receive update", (data) => cb(err, data));
}

export function updateOut(data) {
    socket.emit("update algo", data);
}

export function joinQueue() {
    socket.emit("join queue");
}
