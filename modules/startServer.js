const bonjour = require("bonjour")();
const startSignalingServer = require("./signaling_server");

const port = 3000;

let connections = new Set();

async function startServer(mainWindow) {
  const { httpServer, io } = await startSignalingServer(port);

  bonjour.publish({ name: "signal-server", type: "http", port });

  io.on("connection", (socket) => {
    console.log("User has connected");
    connections.add(socket);
    try {
      mainWindow.webContents.send("socket-connected", socket.id);
      console.log("Sent socket.id to the front");
    } catch (err) {
      console.error(
        "Something went wrong in sending socketId to frontend",
        err,
      );
    }
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
      mainWindow.webContents.send("socket-connected", socket.id);
    });
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
