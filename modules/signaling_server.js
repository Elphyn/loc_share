let httpServer;
let io;

function startSignalingServer(port) {
  return new Promise((resolve, reject) => {
    httpServer = require("node:http").createServer();
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    httpServer.listen(port, "0.0.0.0", () => {
      resolve({ httpServer, io });
    });

    httpServer.on("error", reject);
  });
}

module.exports = startSignalingServer;
