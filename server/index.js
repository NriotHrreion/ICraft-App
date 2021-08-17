const WebSocket = require("ws");
const logger = require("./logger");
const fs = require("fs");
const path = require("path");
const nutils = require("../public/client/lib/utils");

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname +"/config.json")).toString());
const data = JSON.parse(fs.readFileSync(path.resolve(__dirname +"/data.json")).toString());

var wss = new WebSocket.Server({
    port: config.port
});
var isNewMap = false;
var map = new Array(540 / 20).fill(0);

for(let i in map) {
    var arr = new Array(1200 / 20).fill(1);
    for(let j in arr) {
        arr[j] = null;
    }
    
    map[i] = arr;
}

var players = [];

const worldPath = path.resolve(__dirname +"/"+ config.worldName +".cmworld");

loadMapData();

wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
        msg = JSON.parse(msg);
        // eslint-disable-next-line default-case
        switch(msg.type) {
            case "joinServer":
                var playerName = msg.data.playerName;
                var playerX = getPlayerPosition(playerName) == undefined ? 5 : getPlayerPosition(playerName).x;
                var playerY = getPlayerPosition(playerName) == undefined ? 18 : getPlayerPosition(playerName).y;

                setPlayerPosition(playerName, playerX, playerY);

                players.push({
                    playerName: msg.data.playerName,
                    x: playerX,
                    y: playerY
                });

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
                for(let i in players) {
                    if(players[i] != undefined && players[i].playerName == msg.data.playerName) {
                        players[i] = undefined;
                    }
                }
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
            case "blockBreak":
                setBlock(msg.data.posX, msg.data.posY, "air");
                sendMapDataToClient();
                break;
            case "playerMove":
                setPlayerPosition(msg.data.player, msg.data.posX, msg.data.posY);

                wss.clients.forEach((client) => {
                    client.send(JSON.stringify({
                        type: "playerMove",
                        data: {
                            position: [msg.data.posY, msg.data.posX],
                            texture: msg.data.texture,
                            playerName: msg.data.player
                        }
                    }));
                });
                break;
            case "chatMessage":
                logger.message(msg.data.playerName, msg.data.message);
                sendChatMessage(msg.data.playerName, msg.data.message);
                break;
            case "motd":
                wss.clients.forEach((client) => {
                    client.send(JSON.stringify({
                        type: "motd",
                        data: {
                            motd: config.serverMotd
                        }
                    }));
                });
                break;
            case "playerList":
                players = [...new Set(players)];
                wss.clients.forEach((client) => {
                    client.send(JSON.stringify({
                        type: "playerList-"+ msg.data.token,
                        data: {
                            list: players
                        }
                    }));
                });
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
    var mapData;

    try {
        mapData = fs.readFileSync(worldPath, "utf-8").toString();
        return mapData;
    } catch {
        fs.writeFileSync(worldPath, "[./sources/default_icon.png];[air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air,air]");
        logger.info("Cannot find specified map file, generated a new one");
        isNewMap = true;
        return getMapData();
    }
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

    // Generate new terrain
    if(isNewMap) {
        var mapHeight = map.length;
        var mapWidth = map[0].length;
        var terrainHeight = 8;

        try {
            for(var i = 0; i < mapWidth; i++) {
                for(var j = terrainHeight; j > 0; j--) {
                    // grass block
                    setBlock(i, mapHeight - j, "grass_block");

                    // stone
                    if(j < terrainHeight - 2) {
                        setBlock(i, mapHeight - j, "stone");
                    }

                    // tree
                    // var treeM = getRandom(1, 30);
                    // if(treeM == 5) {
                    //     setBlock(i, mapHeight - terrainHeight - 1, "oak_sapling");
                    // }
                }

                // bedrock
                setBlock(i, mapHeight - 1, "bedrock");
    
                var rn = getRandom(1, 10);

                if(rn <= 2) {
                    terrainHeight -= 1;
                } else if(rn > 2 && rn <= 8) {
                    terrainHeight += 0;
                } else if(rn > 8) {
                    terrainHeight += 1;
                }

                // terrainHeight = terrainHeight + rn == 0 ? terrainHeight + 1 : terrainHeight + rn;
            }
        } catch {
            //
        }

        isNewMap = false;
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

function getPlayerPosition(name) {
    var positions = data.playerPosition;
    for(let i in positions) {
        if(positions[i].playerName == name) {
            return positions[i];
        }
    }
    return undefined;
}

function setPlayerPosition(name, x, y) {
    var positions = data.playerPosition;
    for(let i in positions) {
        if(positions[i].playerName == name) {
            positions[i].x = x;
            positions[i].y = y;
            fs.writeFileSync(path.resolve(__dirname +"/data.json"), JSON.stringify(data));
        }
    }
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
