const bonjour = require("bonjour")();
const startSignalingServer = require("./signaling_server");

const port = 3000;

let connections = new Set();

async function startServer(mainWindow) {
  const { httpServer, io } = await startSignalingServer(port);

  bonjour.publish({ name: "signal-server", type: "http", port });

  io.on("connection", (socket) => {
    console.log("User has connected");

    socket.on("signal", ({ to, signal }) => {
      const target = io.sockets.sockets.get(to);
      console.log("Server recieved signal, redirecting to: ", target.id);

      if (target) {
        target.emit("signal", { from: socket.id, signal });
      } else {
        console.log(`There's no socket with an id:${to}`);
      }
    });
    socket.on("disconnect", () => {
      console.log("User has disconnected");
      connections.delete(socket);

      socket.emit("socket:disconnected", socket.id);
    });

    connections.forEach((connection) => {
      socket.emit("socket:connected", connection.id);
    });
    connections.add(socket);
    io.emit("socket:connected", socket.id);
  });

  return {
    httpServer,
    io,
    getConnections: () => connections,
    stop: () => {
      bonjour.unpublishAll();
      bonjour.destroy();
      httpServer.stop();
    },
  };
}

module.exports = startServer;
