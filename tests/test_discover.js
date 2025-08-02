const bonjour = require("bonjour")();

function discoverService() {
  console.log("in function");
  return new Promise((resolve, reject) => {
    console.log("before discovery");
    const browser = bonjour.find({ type: "http" });
    console.log("Started discovery");

    browser.on("up", (service) => {
      resolve(service);
    });
  });
}

async function main() {
  console.log("Main called");

  const res = await discoverService();
  console.log("found", res);
}

main();
