const WebSocket = require("ws");
const logger = require("./logger");
const fs = require("fs");
const path = require("path");

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname +"/config.json")).toString());

var wss = new WebSocket.Server({
    port: config.port
});
var map = new Array(540 / 20).fill(0);

for(let i in map) {
    var arr = new Array(1200 / 20).fill(1);
    for(let j in arr) {
        arr[j] = null;
    }
    
    map[i] = arr;
}

const worldPath = path.resolve(__dirname +"/"+ config.worldName +".cmworld");

loadMapData();

wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
        msg = JSON.parse(msg);
        // eslint-disable-next-line default-case
        switch(msg.type) {
            case "joinServer":
                logger.info(`${msg.data.playerName} joined the server`);
                sendMapDataToClient();
                wss.clients.forEach((client) => {
                    var time = new Date();

                    client.send(JSON.stringify({
                        type: "playerJoin",
                        data: {
                            playerName: msg.data.playerName,
                            time: time.getHours() +":"+ time.getMinutes()
                        }
                    }));
                });
                break;
            case "leaveServer":
                logger.info(`${msg.data.playerName} left the server`);
                wss.clients.forEach((client) => {
                    var time = new Date();

                    client.send(JSON.stringify({
                        type: "playerLeave",
                        data: {
                            playerName: msg.data.playerName,
                            time: time.getHours() +":"+ time.getMinutes()
                        }
                    }));
                });
                break;
            case "blockPlace":
                setBlock(msg.data.posX, msg.data.posY, msg.data.block);
                sendMapDataToClient();
                break;
            case "chatMessage":
                logger.message(msg.data.playerName, msg.data.message);
                sendChatMessage(msg.data.playerName, msg.data.message);
                break;
        }
    });
});

wss.on("close", () => {
    logger.info("Server closed");
    
});
logger.info("WebSocket prepared");

fs.exists(worldPath, (exists) => {
    if(!exists) {
        logger.error("Cannot read "+ config.worldName +".cmworld in the server dir! Please add "+ config.worldName +".cmworld file to this dir.");
        logger.info("Server crashed");
        process.exit(0);
    }

    loadMapData();
});

logger.info("Server opened on localhost:"+ config.port);

function getMapData() {
    return fs.readFileSync(worldPath, "utf-8").toString();
}

function loadMapData() {
    var mapData = getMapData();

    var dataParts = mapData.split(";");
    if(dataParts.length == 2) {
        // var icon = dataParts[0].replace("[", "").replace("]", "");
        // this.setIcon(icon);
        var level = dataParts[1].replace("[", "").replace("]", "").split(",");
    } else {
        var level = mapData.replace("[", "").replace("]", "").split(",");
    }

    var num = 0;

    for(let y = 0; y < map.length; y++) {
        for(let x = 0; x < map[y].length; x++) {
            map[y][x] = level[num];
            num++;
        }
    }
}

function saveMapData() {
    var arr_str = map.toString();

    for(let y = 0; y < map.length; y++) {
        for(let x = 0; x < map[y].length; x++) {
            arr_str = arr_str.replace("[object Object]", map[y][x]);
        }
    }

    arr_str = "["+ arr_str +"]";

    fs.writeFileSync(worldPath, arr_str);
}

function sendMapDataToClient() {
    wss.clients.forEach((client) => {
        client.send(JSON.stringify({
            type: "mapData",
            data: getMapData()
        }));
    });
}

function setBlock(posX, posY, blockName) {
    if(blockName != "sand") {
        map[posY][posX] = blockName;
        saveMapData();
    }
}

function sendChatMessage(playerName, message) {
    wss.clients.forEach((client) => {
        var time = new Date();

        client.send(JSON.stringify({
            type: "chatMessage",
            data: {
                playerName: playerName,
                message: message,
                time: time.getHours() +":"+ time.getMinutes()
            }
        }));
    });
}
