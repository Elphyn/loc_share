const bonjour = require("bonjour")();

function discoverService() {
  return new Promise((resolve, reject) => {
    const browser = bonjour.find({ type: "http" });

    browser.on("up", (service) => {
      resolve(service);
    });
  });
}

module.exports = discoverService;
