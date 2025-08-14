const bonjour = require("bonjour")();

function discoverService() {
  return new Promise((resolve, reject) => {
    try {
      console.log("Trying to find a bonjour service...");
      const browser = bonjour.find({ type: "http" });
      browser.on("up", (service) => {
        cleanup();
        resolve(service);
      });
      function cleanup() {
        try {
          console.log("Cleaning bonjour(client)");
          browser.stop();
          bonjour.destroy();
        } catch (err) {
          console.error("Couldn't clean up broswer: ", err);
        }
      }
    } catch (err) {
      console.error("Failed  to find a bonjour service, err: ", err);
    }
  });
}

module.exports = discoverService;
