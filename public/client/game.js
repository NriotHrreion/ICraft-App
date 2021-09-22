/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
/* eslint-disable default-case */
/**
 * **ICraft**
 * 
 * @author NriotHrreion
 * @license MIT
 */

/** @enum {PlayerDirection} */
var PlayerDirection = {
    LEFT: 0,
    RIGHT: 1
};

var DayTime = {
    DAY: 0,
    NIGHT: 1
};

class ICraft {
    constructor(canvas, playerName) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = canvas.getContext("2d");
        /** @type {string} */
        this.playerName = playerName;
        this.players = [];
        this.addPlayer(this.playerName);
        this.currentBlock = "stone";
        this.daynight = DayTime.DAY;
        this.iconPath = "./sources/default_icon.png";

        this.isDrawing = false;
        this.isCleaning = false;
        this.isMusicPlaying = false;
        this.isPlayerWalking = false;
        this.isChatting = false;

        this.mousePosition = {x: 0, y: 0};
        this.fps = 80;
        this.renderer = new Render(this);
        /** @type {Command} */
        this.commandManager = new Command(this);

        this.navbar = document.getElementById("navbar");
        /** @type {HTMLSpanElement} */
        this.statusText = document.getElementById("status");
        /** @type {HTMLDialogElement} */
        this.chatContainer = document.getElementById("chat");
        this.messagesContainer = document.getElementById("chat-messages");
        this.chatInput = document.getElementById("chat-input");
        this.chatSendButton = document.getElementById("chat-send");

        this.timer = null;
        this.worldName = "";

        // Listeners
        this.canvas.addEventListener("draw", () => {});
        this.canvas.addEventListener("undraw", () => {});
        this.canvas.addEventListener("blockChange", () => {});
        this.canvas.addEventListener("iconChange", () => {});
        this.canvas.addEventListener("playerMove", () => {});

        Log.info("Loaded player \""+ this.playerName +"\" <Game>");
    }

    main() {
        var self = this;
        Log.info("Launching ICraft... <Game.main>");

        this.initBackground();
        this.initTextures();
        // this.initIcon();
        this.initPlayer();
        this.initCommand();
        this.initKeyBinds();

        this.canvas.addEventListener("mousedown", (e) => {
            if(e.button == 0) {
                this.setDrawing(true);
            } else if(e.button == 2) {
                this.setCleaning(true);
            }
        });
        this.canvas.addEventListener("mouseup", () => {
            this.setDrawing(false);
            this.setCleaning(false);
        });
        this.canvas.addEventListener("mousemove", (e) => {
            this.mousePosition.x = e.offsetX - this.renderer.blockSize / 2;
            this.mousePosition.y = e.offsetY - this.renderer.blockSize / 2;
        });
        this.canvas.addEventListener("mouseleave", () => {
            this.mousePosition = {x: 0, y: 0};
            this.setDrawing(false);
            this.setCleaning(false);
        });
        this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
        document.body.addEventListener("keydown", (e) => {
            if(e.key == "Enter") {
                this.sendMessage();
            }
        });
        for(let i = 0; i < document.getElementsByTagName("button").length; i++) {
            document.getElementsByTagName("button")[i].addEventListener("click", function() {
                self.buttonClick(this);
            });
        }

        this.timer = setInterval(() => {
            this.renderer.update();
        }, 1000 / this.fps);

        // Time Tick
        setInterval(() => {
            this.daynight = this.daynight == DayTime.DAY ? DayTime.NIGHT : DayTime.DAY;
        }, 300000); // per 5 minutes

        if(window.location.search.indexOf("?map=") != -1) { // solo map mode
            this.loadLevel();
        } else if(window.location.search.indexOf("?server=") != -1) { // server mode
            var clientPluginScript = document.createElement("script");
            clientPluginScript.src = "./plugins/client.js";
            document.body.appendChild(clientPluginScript);
        }

        Log.info("ICraft Inited. fps: "+ this.fps +" <Game.main>");
    }

    initBackground() {
        var grd;

        switch(this.daynight) {
            case DayTime.DAY:
                grd = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
                grd.addColorStop(0, "rgb(218, 237, 254)");
                grd.addColorStop(0.5, "white");
                grd.addColorStop(1, "white");
        
                this.ctx.fillStyle = grd;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.canvas.style.borderColor = "rgb(184, 184, 184)";
                break;
            case DayTime.NIGHT:
                grd = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
                grd.addColorStop(0, "rgb(60, 60, 60)");
                grd.addColorStop(0.5, "rgb(40, 40, 40)");
                grd.addColorStop(1, "black");
        
                this.ctx.fillStyle = grd;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(this.renderer.getTexture("texture:moon"), 120, 50);
                this.canvas.style.borderColor = "rgb(90, 90, 90)";
                break;
        }
    }

    initTextures() {
        var self = this;
        var blockList = window.blocks;
        var blockListElem = document.getElementById("block-list");

        blockListElem.innerHTML = "";

        for(var i in blockList) {
            if(blockList[i].getName() == "air") continue;

            var button = document.createElement("button");
            button.setAttribute("data-block", blockList[i].getName());
            button.addEventListener("click", function() {
                self.buttonClick(this);
            });
            var img = document.createElement("img");
            img.src = "./textures/"+ blockList[i].getTexture().replace("texture:", "") +".png";
            img.id = blockList[i].getTexture();
            button.appendChild(img);
            blockListElem.appendChild(button);
        }

        Log.info("Textures Inited. <Game.initTextures>");
    }

    /** @deprecated */
    initIcon() {
        document.getElementById("icon").src = this.iconPath;

        Log.info("Icon Inited. <Game.initIcon>");
    }

    initPlayer() {
        document.body.addEventListener("keydown", (e) => { // control moving
            var px = this.renderer.player.x;
            var py = this.renderer.player.y;

            switch(e.key) {
                case " ":
                    this.resetPlayerTexture();
                    if(py > 0 && this.renderer.map[this.getRealPosition(py - this.renderer.blockSize / 2)][this.getRealPosition(px)] instanceof BlockAir) {
                        this.renderer.player.y -= 2;
                        this.canvas.dispatchEvent(new CustomEvent("playerMove", {detail: {
                            position: [py, px],
                            texture: this.renderer.player.texture,
                            player: this.playerName
                        }}));
                        this.getSelfPlayer().pos.x = this.renderer.player.x;
                        this.getSelfPlayer().pos.y = this.renderer.player.y;
                        this.getSelfPlayer().texture = this.renderer.player.texture;
                        this.isPlayerWalking = false;
                    }
                    break;
                case "w":
                    this.resetPlayerTexture();
                    if(py > 0 && this.renderer.map[this.getRealPosition(py - this.renderer.blockSize / 2)][this.getRealPosition(px)] instanceof BlockAir) {
                        this.renderer.player.y -= 2;
                        this.canvas.dispatchEvent(new CustomEvent("playerMove", {detail: {
                            position: [py, px],
                            texture: this.renderer.player.texture,
                            player: this.playerName
                        }}));
                        this.getSelfPlayer().pos.x = this.renderer.player.x;
                        this.getSelfPlayer().pos.y = this.renderer.player.y;
                        this.getSelfPlayer().texture = this.renderer.player.texture;
                        this.isPlayerWalking = false;
                    }
                    break;
                case "a":
                    this.isPlayerWalking = true;
                    this.renderer.player.direction = PlayerDirection.LEFT;
                    if(px > 0 && this.renderer.map[this.getRealPosition(py)][this.getRealPosition(px - this.renderer.blockSize / 2)] instanceof BlockAir && this.renderer.map[this.getRealPosition(py + this.renderer.blockSize)][this.getRealPosition(px - this.renderer.blockSize / 2)] instanceof BlockAir) {
                        this.renderer.player.x -= 2;
                        this.canvas.dispatchEvent(new CustomEvent("playerMove", {detail: {
                            position: [py, px],
                            texture: this.renderer.player.texture,
                            player: this.playerName
                        }}));
                        this.getSelfPlayer().pos.x = this.renderer.player.x;
                        this.getSelfPlayer().pos.y = this.renderer.player.y;
                        this.getSelfPlayer().texture = this.renderer.player.texture;
                    }
                    break;
                case "s":
                    this.resetPlayerTexture();
                    if(py < this.canvas.height - this.renderer.blockSize * 2 && this.renderer.map[this.getRealPosition(py + this.renderer.blockSize * 2 - this.renderer.blockSize / 2)][this.getRealPosition(px)] instanceof BlockAir) {
                        this.renderer.player.y += 2;
                        this.canvas.dispatchEvent(new CustomEvent("playerMove", {detail: {
                            position: [py, px],
                            texture: this.renderer.player.texture,
                            player: this.playerName
                        }}));
                        this.getSelfPlayer().pos.x = this.renderer.player.x;
                        this.getSelfPlayer().pos.y = this.renderer.player.y;
                        this.getSelfPlayer().texture = this.renderer.player.texture;
                    }
                    break;
                case "d":
                    this.isPlayerWalking = true;
                    this.renderer.player.direction = PlayerDirection.RIGHT;
                    if(px < this.canvas.width - this.renderer.blockSize && this.renderer.map[this.getRealPosition(py)][this.getRealPosition(px + this.renderer.blockSize - this.renderer.blockSize / 2)] instanceof BlockAir && this.renderer.map[this.getRealPosition(py + this.renderer.blockSize)][this.getRealPosition(px + this.renderer.blockSize - this.renderer.blockSize / 2)] instanceof BlockAir) {
                        this.renderer.player.x += 2;
                        this.canvas.dispatchEvent(new CustomEvent("playerMove", {detail: {
                            position: [py, px],
                            texture: this.renderer.player.texture,
                            player: this.playerName
                        }}));
                        this.getSelfPlayer().pos.x = this.renderer.player.x;
                        this.getSelfPlayer().pos.y = this.renderer.player.y;
                        this.getSelfPlayer().texture = this.renderer.player.texture;
                    }
                    break;
            }
        });
        document.body.addEventListener("keyup", () => { // stop moving
            var px = this.renderer.player.x;
            var py = this.renderer.player.y;

            this.isPlayerWalking = false;
            this.resetPlayerTexture();
            this.canvas.dispatchEvent(new CustomEvent("playerMove", {detail: {
                position: [py, px],
                texture: this.renderer.player.texture,
                player: this.playerName
            }}));
        });
        setInterval(() => { // change player walking texture
            if(this.isPlayerWalking) {
                var dir;
                switch(this.renderer.player.direction) {
                    case PlayerDirection.LEFT:
                        dir = "left";
                        break;
                    case PlayerDirection.RIGHT:
                        dir = "right";
                        break;
                }
        
                if(this.renderer.player.texture == this.renderer.getTexture("texture:player_walking_"+ dir +"_1")) {
                    this.renderer.player.texture = this.renderer.getTexture("texture:player_walking_"+ dir +"_2");
                } else {
                    this.renderer.player.texture = this.renderer.getTexture("texture:player_walking_"+ dir +"_1");
                }
            }
        }, 150);
        // setInterval(() => { // gravity
        //     var px = this.renderer.player.x;
        //     var py = this.renderer.player.y;

        //     try {
        //         if(this.renderer.map[this.getRealPosition(py + this.renderer.blockSize * 2 - this.renderer.blockSize / 2)][this.getRealPosition(px)] instanceof BlockAir) {
        //             this.renderer.player.y += 1;
        //         }
        //     } catch {
        //         this.resetPlayerPosition();
        //     }
        // }, 10);
    }

    initCommand() {
        this.commandManager.register("about", new CommandAbout(this));
        this.commandManager.register("say", new CommandSay(this));
        this.commandManager.register("me", new CommandMe(this));
        this.commandManager.register("suicide", new CommandSuicide(this));
    }

    initKeyBinds() {
        nutils.bindKeyListener("Escape", false, true, () => {
            if(this.isChatting) {
                document.getElementById("chat").close();
                this.isChatting = false;
            } else {
                this.saveLevel();
                window.location.href = "http://"+ window.location.host +"/home";
            }
        });
        nutils.bindKeyListener("t", false, false, () => {
            if(!this.isChatting) {
                document.getElementById("chat").show();
                this.isChatting = true;
            }
        });
        nutils.bindKeyListener("m", false, false, () => {
            if(!this.isMusicPlaying) {
                document.getElementById("source:music").play();
                this.isMusicPlaying = true;
            } else {
                document.getElementById("source:music").pause();
                this.isMusicPlaying = false;
            }
        });
        nutils.bindKeyListener("d", true, true, () => download(this.canvas.toDataURL("image/png")));
        nutils.bindKeyListener("r", true, true, () => this.renderer.clearData());
        nutils.bindKeyListener("s", true, true, () => this.saveLevel());
    }

    resetPlayerTexture() {
        switch(this.renderer.player.direction) {
            case PlayerDirection.LEFT:
                this.getSelfPlayer().texture = this.renderer.player.texture = this.renderer.getTexture("texture:player_stand_left");
                break;
            case PlayerDirection.RIGHT:
                this.getSelfPlayer().texture = this.renderer.player.texture = this.renderer.getTexture("texture:player_stand_right");
                break;
        }
    }

    resetPlayerPosition() {
        this.renderer.player.x = this.renderer.player.y = 0;
    }

    buttonClick(blockElem) {
        switch(blockElem.getAttribute("data-block")) {
            case "$quit":
                this.saveLevel();
                window.location.href = "http://"+ window.location.host +"/home";
                break;
            case "$music":
                if(!this.isMusicPlaying) {
                    document.getElementById("source:music").play();
                    this.isMusicPlaying = true;
                } else {
                    document.getElementById("source:music").pause();
                    this.isMusicPlaying = false;
                }
                break;
            // case "$icon":
            //     this.setIcon(prompt("图标地址(URL)"));
            //     break;
            case "$plugin":
                this.loadPlugin();
                break;
            case "$reset":
                this.renderer.clearData();
                break;
            case "$save":
                this.saveLevel();
                break;
            // case "$load":
            //     this.loadLevel();
            //     break;
            case "$download":
                // eslint-disable-next-line
                download(this.canvas.toDataURL("image/png"));
                break;
            case "$send-message":
                this.sendMessage();
                break;
            case "$chat":
                if(this.isChatting) {
                    document.getElementById("chat").close();
                    this.isChatting = false;
                } else {
                    document.getElementById("chat").show();
                    this.isChatting = true;
                }
                break;
            default:
                this.setCurrentBlock(blockElem.getAttribute("data-block"));

                var eventData = new CustomEvent("blockChange", {detail: {
                    blockName: this.currentBlock
                }});
                this.canvas.dispatchEvent(eventData);
        }
    }

    saveLevel() {
        var arr_str = this.renderer.map.toString();

        for(let y = 0; y < this.renderer.map.length; y++) {
            for(let x = 0; x < this.renderer.map[y].length; x++) {
                arr_str = arr_str.replace("[object Object]", this.renderer.map[y][x].blockName);
            }
        }

        arr_str = "["+ arr_str +"]";

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://"+ window.location.hostname +":3001/saveWorld");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("name="+ this.worldName +"&data="+ arr_str);
        xhr.onload = () => {
            this.setStatusText("保存成功");

            Log.info("Level Saved. <Game.saveLevel>");
        };
    }

    loadLevel() { // Fetch map data from the API
        var mapPath = window.location.search.replace("?", "").split("&")[0].replace("map=", "");

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://"+ window.location.hostname +":3001/maps/"+ mapPath);
        xhr.send(null);
        xhr.onload = () => {
            var mapData = xhr.responseText;

            var dataParts = mapData.split(";");
            var level;
            if(dataParts.length == 2) {
                var icon = dataParts[0].replace("[", "").replace("]", "");
                this.setIcon(icon);
                level = dataParts[1].replace("[", "").replace("]", "").split(",");
            } else {
                level = mapData.replace("[", "").replace("]", "").split(",");
            }
    
            var num = 0;
    
            for(let y = 0; y < this.renderer.map.length; y++) {
                for(let x = 0; x < this.renderer.map[y].length; x++) {
                    if(level[num].indexOf("oak_door") != -1) {
                        this.renderer.map[y][x] = new window.blocks["oak_door"](level[num].replace("oak_door_", ""), this.renderer, x, y);
                    } else {
                        this.renderer.map[y][x] = new window.blocks[level[num]](this.renderer, x, y);
                    }
                    num++;
                }
            }

            this.worldName = mapPath.replace(".cmworld", "");
    
            Log.info("Level Loaded. <Game.loadLevel>");
            Log.info("Level data: ", level);
        };
    }

    /** @deprecated */
    loadMap(mapData) { // Get map data from user (deprecated)
        var dataParts = mapData.split(";");
        if(dataParts.length == 2) {
            var icon = dataParts[0].replace("[", "").replace("]", "");
            this.setIcon(icon);
            var level = dataParts[1].replace("[", "").replace("]", "").split(",");
        } else {
            var level = mapData.replace("[", "").replace("]", "").split(",");
        }

        var num = 0;

        for(let y = 0; y < this.renderer.map.length; y++) {
            for(let x = 0; x < this.renderer.map[y].length; x++) {
                if(level[num].indexOf("oak_door") != -1) {
                    this.renderer.map[y][x] = new window.blocks["oak_door"](level[num].replace("oak_door_", ""));
                } else {
                    this.renderer.map[y][x] = new window.blocks[level[num]](this.renderer, x, y);
                }
                num++;
            }
        }
    }

    addPlayer(name) {
        this.players.push(new Player(this, name));
        return this.getPlayer(name);
    }

    removePlayer(name) {
        for(let i in this.players) {
            if(this.players[i].name == name) {
                this.players = nutils.arrayItemDelete(this.players, this.players[i]);
            }
        }
    }

    /**
     * 
     * @param {string} name
     * @returns {Player}
     */
    getPlayer(name) {
        for(let i in this.players) {
            if(this.players[i].name == name) {
                return this.players[i];
            }
        }
    }

    /**
     * 
     * @returns {Player}
     */
    getSelfPlayer() {
        return this.getPlayer(this.playerName);
    }

    setCurrentBlock(blockName) {
        this.currentBlock = blockName;
    }

    setDrawing(isDrawing) {
        this.isDrawing = isDrawing;
    }

    setCleaning(isCleaning) {
        this.isCleaning = isCleaning;
    }

    setIcon(iconPath) {
        if(iconPath) {
            this.iconPath = iconPath;
            this.initIcon();
            
            var eventData = new CustomEvent("iconChange", {detail: {
                icon: iconPath
            }});
            this.canvas.dispatchEvent(eventData);
    
            Log.info("Setted. icon path: "+ this.iconPath +" <Game.setIcon>");
        }
    }

    loadPlugin() {
        /** @type {HTMLInputElement} */
        var input = document.getElementById("pluginInput");
        input.click();
        input.onchange = () => {
            var fr = new FileReader();
            fr.readAsText(input.files[0]);
            fr.onload = () => {
                var blobURL = window.URL.createObjectURL(new Blob([fr.result], {type: "text/javascript;charset=utf-8"}));
                var scriptElem = document.createElement("script");
                scriptElem.src = blobURL;
                document.body.appendChild(scriptElem);

                Log.info("Plugin Loaded as BlobURL. <Game.loadPlugin>");
            };
        };
    }

    setFps(fps) {
        this.fps = fps;

        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.renderer.update();
        }, 1000 / this.fps);

        Log.info("Setted. fps: "+ this.fps +" <Game.setFps>");
    }

    setStatusText(text) {
        this.statusText.innerText = text;

        setTimeout(() => {
            this.statusText.innerText = "";
        }, 1500);
    }

    displayMessage(playerName, message) {
        var time = new Date().getHours() +":"+ new Date().getMinutes();

        var messageBlock = document.createElement("div");
        messageBlock.className = "message";
        var infoLabel = document.createElement("span");
        infoLabel.innerText = playerName +" "+ time;
        messageBlock.appendChild(infoLabel);
        var messageText = document.createElement("p");
        messageText.innerText = message;
        messageBlock.appendChild(messageText);
        this.messagesContainer.appendChild(messageBlock);
    }

    sendMessage() {
        if(window.location.search.indexOf("server=") == -1 && this.chatInput.value.indexOf("/") == -1) {
            this.displayMessage("", this.chatInput.value);
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        } else if(this.chatInput.value.indexOf("/") > -1) {
            this.commandManager.dispatch(this.chatInput.value.replace("/", "").split(" ")[0], {
                command: this.chatInput.value.replace("/", ""),
                args: this.chatInput.value.replace("/", "").split(" "),
                sender: this.playerName
            });
        }
        this.chatInput.value = "";
    }

    getRealPosition(pos) {
        return Math.round(pos / this.renderer.blockSize);
    }

    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

class Player {
    constructor(game, name) {
        /** @type {ICraft} */
        this.game = game;
        /** @type {Render} */
        this.renderer = this.game.renderer;
        /** @type {string} */
        this.name = name;
        this.pos = {
            x: 5,
            y: 18
        };
        this.direction = 1; // 0 left; 1 right
        this.texture = document.getElementById("texture:player_stand_right");
    }

    setPosition(x, y) {
        this.pos = {
            x: x,
            y: y
        };
        this.renderer.player.x = x;
        this.renderer.player.y = y;
    }
}
