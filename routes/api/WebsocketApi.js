const WebSocket = require('ws');
const url = require('url');

const channels = new Map();

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        const query = url.parse(req.url, true).query;
        const channelID = query.channel_id;

        if (!channelID) {
            ws.close();
            return;
        }

        if (!channels.has(channelID)) {
            channels.set(channelID, new Set());
        }
        channels.get(channelID).add(ws);

        ws.on('message', (message) => {
            console.log(`Received message in channel ${channelID}:`, message);
            broadcastMessage(channelID, message);
        });

        ws.on('close', () => {
            channels.get(channelID).delete(ws);
            if (channels.get(channelID).size === 0) {
                channels.delete(channelID);
            }
        });
    });

    function broadcastMessage(channelID, message) {
        if (!channels.has(channelID)) return;

        channels.get(channelID).forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}

module.exports = setupWebSocket;
