const socket = require("socket.io");
const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        // Handle Events
        socket.on("joinchat", () => {});
        socket.on("sendMessage", () => {});
        socket.on("disconnect", () => {});
    });
};
module.exports = initializeSocket;
