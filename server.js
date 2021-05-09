const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const worldsPath = path.resolve("./src/worlds");

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
    fs.writeFileSync(path.join(worldsPath, worldInfo.name +".cmworld"), worldInfo.mapData);
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
            worldList[i].name = req.body.newname;
            break;
        }
    }

    fs.rename(path.join(worldsPath, oldname +".cmworld"), path.join(worldsPath, newname +".cmworld"), () => {});
});

app.listen(3001);
