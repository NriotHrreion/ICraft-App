const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const worldsPath = path.resolve("./src/worlds");
const serverListPath = path.resolve("./src/_serverList.json");
const userNamePath = path.resolve("./src/_username.txt");

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
    fs.writeFileSync(userNamePath, userName.replace(/[ |-|\\|/|!|@|#|$|%|^|&|*|(|)]/g, ""));
    
    res.end();
});

app.listen(3001);
