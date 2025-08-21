const net = require('net');

const LISTEN_PORT = 2222; // Port you will SSH into (from your PC)
const TUNNEL_PORT = 2200; // Port Raspberry Pi's reverse tunnel will bind 

const server = net.createServer((pcSocket) => {
  console.log('New connection from your PC');

  // Connect to the Raspberry Pi tunnel on localhost:TUNNEL_PORT
  const piSocket = net.connect({ host: '127.0.0.1', port: TUNNEL_PORT }, () => {
    console.log('🔗 Connected to Raspberry Pi tunnel');

    // Pipe data both ways
    pcSocket.pipe(piSocket);
    piSocket.pipe(pcSocket);
  });

  piSocket.on('error', (err) => {
    console.error('Error with Raspberry Pi socket:', err.message);
    pcSocket.end();
  });

  pcSocket.on('error', (err) => {
    console.error('Error with PC connection:', err.message);
    piSocket.end();
  });
});

server.listen(LISTEN_PORT, () => {
  console.log(`Relay server listening on port ${LISTEN_PORT}`);
});
