const bonjour = require('bonjour')()

const browser = bonjour.find({ type: 'http'})


browser.on('up', service => {
  console.log('Service found:', service.name);
  console.log('Host:', service.host);
  console.log('Port:', service.port);
  console.log('Addresses:', service.addresses);
});