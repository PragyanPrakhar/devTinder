const socket = require("socket.io");
const crypto = require("crypto");

const createSecretRoomId = ({ userId, targetUserId }) => {
    return crypto
        .createHash("sha256")
        .update([userId, targetUserId].sort().join("_"))
        .digest("hex");
};
const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        // Handle Events
        socket.on("joinChat", ({ userId, targetUserId }) => {
            const roomId = createSecretRoomId(userId, targetUserId);
            console.log("Joining Room :-> ", roomId);
            socket.join(roomId);
        });
        socket.on(
            "sendMessage",
            ({ firstName, userId, targetUserId, text }) => {
                const roomId = createSecretRoomId(userId, targetUserId);
                console.log(firstName + " " + text);
                io.to(roomId).emit("messageReceived", { firstName, text });
            }
        );
        socket.on("disconnect", () => {});
    });
};
module.exports = initializeSocket;
