const { startSignalingServer } = require("./signaling_server");

const bonjourModule = require("bonjour");

const port = 3000;

let connections = new Set();

async function startServer() {
  const bonjour = bonjourModule();
  const { httpServer, io } = await startSignalingServer(port);

  try {
    console.log("Publishing bonjour service");

    bonjour.publish({ name: "signal-server", type: "http", port });
    const browser = bonjour.find({ type: "http" });
    browser.once("up", (service) => {
      console.log("Service: ", service);
    });
    console.log("Bublishing is successufl");
  } catch (err) {
    console.error("Error trying to pubilsh bonjour", err);
  }

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

      socket.broadcast.emit("socket:disconnected", socket.id);
    });

    connections.forEach((connection) => {
      socket.emit("socket:connected", connection.id);
    });
    connections.add(socket);
    io.emit("socket:connected", socket.id);
  });

  function stopServer() {
    return new Promise((resolve, reject) => {
      connections.forEach((socket) => {
        io.emit("socket:disconnected", socket.id);
        socket.disconnect(true);
      });
      connections.clear();

      httpServer.close(() => {
        try {
          console.log("Stopping server, unpublish service");
          bonjour.unpublishAll();
          bonjour.destroy();
          console.log("Removed bonjour service");
          resolve();
        } catch (err) {
          console.error("Failed to unpublish bonjour service, err: ", err);
        }
      });
    });
  }

  return {
    httpServer,
    io,
    getConnections: () => connections,
    stop: stopServer,
  };
}

module.exports = startServer;
