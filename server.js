const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

const worldsPath = path.resolve("./src/worlds");
const serverListPath = path.resolve("./src/_serverList.json");
const userNamePath = path.resolve("./src/_username.txt");
const usedNamesPath = path.resolve("./src/_usednames.txt");

var app = express();
var worldList = [];

// load world list
fs.readdir(worldsPath, (err, files) => {
    if(err) return;

    files.forEach((fileName) => {
        var fileDir = path.join(worldsPath, fileName);
        fs.stat(fileDir, (err, stats) => {
            if(err) return;
            if(stats.isDirectory()) return;
            if(fileName.indexOf(".cmworld") == -1) return;

            worldList.push({
                name: fileName.replace(".cmworld", ""),
                fileName: fileName,
                mapData: fs.readFileSync(fileDir, "utf-8")
            });
        });
    });
});

app.use(bodyParser.urlencoded({extended: false}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    next();
});
app.use("/maps", express.static(worldsPath, {
    setHeaders: function(res, path, stat) {
        res.set("Access-Control-Allow-Origin", "*");
    }
}));

app.get("/getWorldList", (req, res) => {
    res.json({
        list: worldList
    });
});

app.post("/createWorld", (req, res) => {
    var worldInfo = {
        name: req.body.name,
        fileName: "",
        mapData: ""
    };

    worldInfo.fileName = worldInfo.name +".cmworld";
    worldInfo.mapData = fs.readFileSync(path.join(path.resolve("./src"), "_empty.cmworld")).toString();

    // Prepare to Generate Terrain
    var map = mapDataToArray(worldInfo.mapData);
    var mapHeight = map.length;
    var mapWidth = map[0].length;
    var terrainHeight = 8;

    if(req.body.terrain == "1") {
        // Start Generating
        try {
            for(var i = 0; i < mapWidth; i++) {
                for(var j = terrainHeight; j > 0; j--) {
                    // grass block
                    map[mapHeight - j][i] = "grass_block";

                    // stone
                    if(j < terrainHeight - 2) {
                        map[mapHeight - j][i] = "stone";
                    }

                    // tree
                    // var treeM = getRandom(1, 30);
                    // if(treeM == 5) {
                    //     setBlock(i, mapHeight - terrainHeight - 1, "oak_sapling");
                    // }
                }

                // bedrock
                map[mapHeight - 1][i] = "bedrock";

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
            // gjshfgajdfkjhsgf
        }
    }

    fs.writeFileSync(path.join(worldsPath, worldInfo.name +".cmworld"), arrayToMapData(map));
    worldList.push(worldInfo);

    res.end();
});

app.post("/deleteWorld", (req, res) => {
    var name = req.body.name;

    for(let i in worldList) {
        if(worldList[i] != undefined && worldList[i].name == name) {
            fs.unlink(path.join(worldsPath, name +".cmworld"), () => {});
            worldList[i] = undefined;
        }
    }

    res.end();
});

app.post("/saveWorld", (req, res) => {
    var worldInfo = {
        name: req.body.name,
        fileName: "",
        mapData: req.body.data
    };

    worldInfo.fileName = worldInfo.name +".cmworld";
    fs.writeFileSync(path.join(worldsPath, worldInfo.name +".cmworld"), worldInfo.mapData);
    // worldList.push(worldInfo);

    res.end();
});

app.post("/renameWorld", (req, res) => {
    var oldname = req.body.oldname;
    var newname = req.body.newname;

    for(let i in worldList) {
        if(worldList[i].name == oldname) {
            worldList[i].name = newname;
            break;
        }
    }

    fs.rename(path.join(worldsPath, oldname +".cmworld"), path.join(worldsPath, newname +".cmworld"), () => {});
});

app.get("/getServerList", (req, res) => {
    res.json({
        list: JSON.parse(fs.readFileSync(serverListPath).toString())
    });
});

app.post("/AddServer", (req, res) => {
    var serverInfo = {
        name: req.body.name,
        ip: req.body.ip
    };
    var list = JSON.parse(fs.readFileSync(serverListPath).toString());
    
    list.push(serverInfo);
    fs.writeFileSync(serverListPath, JSON.stringify(list));
    
    res.end();
});

app.post("/deleteServer", (req, res) => {
    var name = req.body.name;
    var list = JSON.parse(fs.readFileSync(serverListPath).toString());
    var newList = [];

    for(let i in list) {
        if(list[i] != undefined && list[i].name == name) {
            list[i] = undefined;
        }
    }

    for(let i in list) {
        if(list[i] != undefined) {
            newList.push(list[i]);
        }
    }

    fs.writeFileSync(serverListPath, JSON.stringify(newList));

    res.end();
});

app.post("/renameServer", (req, res) => {
    var oldname = req.body.oldname;
    var newname = req.body.newname;
    var list = JSON.parse(fs.readFileSync(serverListPath).toString());

    for(let i in list) {
        if(list[i].name == oldname) {
            list[i].name = newname;
            break;
        }
    }

    fs.writeFileSync(serverListPath, JSON.stringify(list));
    
    res.end();
});

app.get("/getUserName", (req, res) => {
    res.json({
        name: fs.readFileSync(userNamePath).toString()
    });
});

app.post("/setUserName", (req, res) => {
    var userName = req.body.username;
    fs.writeFileSync(userNamePath, userName.replace(/[ |-|\\|/|!|@|#|$|%|^|&|;|*|(|)]/g, ""));

    var usedNames = fs.readFileSync(usedNamesPath).toString().split(";");
    var isUsed = false;
    for(let i in usedNames) {
        if(userName == usedNames[i]) {
            isUsed = true;
        }
    }

    if(!isUsed) {
        usedNames.push(userName);
        fs.writeFileSync(usedNamesPath, usedNames.join(";"));
    }

    res.end();
});

app.get("/getUsedNameList", (req, res) => {
    res.json({
        list: fs.readFileSync(usedNamesPath).toString().split(";")
    });
});

app.listen(3001, () => {
    child_process.exec("react-scripts start");
});

function mapDataToArray(mapData) {
    const blockSize = 20;
    var map = new Array(540 / blockSize).fill(0);

    for(let i in map) {
        var arr = new Array(1200 / blockSize).fill(1);
        for(let j in arr) {
            arr[j] = "air";
        }
        
        map[i] = arr;
    }

    var dataParts = mapData.split(";");
    var level;
    if(dataParts.length == 2) {
        level = dataParts[1].replace("[", "").replace("]", "").split(",");
    } else {
        level = mapData.replace("[", "").replace("]", "").split(",");
    }

    var num = 0;

    for(let y = 0; y < map.length; y++) {
        for(let x = 0; x < map[y].length; x++) {
            map[y][x] = level[num];
            num++;
        }
    }

    return map;
}

function arrayToMapData(map) {
    var arr_str = map.toString();

    for(let y = 0; y < map.length; y++) {
        for(let x = 0; x < map[y].length; x++) {
            arr_str = arr_str.replace("[object Object]", map[y][x]);
        }
    }

    return "["+ arr_str +"]";
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
