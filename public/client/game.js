/* eslint-disable no-undef */
/* eslint-disable default-case */
/**
 * **ICraft**
 * 
 * @author NriotHrreion
 * @license MIT
 */

class Game {
    constructor(canvas, ctx, playerName) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        /** @type {string} */
        this.playerName = playerName;
        this.currentBlock = "stone";
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

        /** @type {HTMLDialogElement} */
        this.chatContainer = document.getElementById("chat");
        this.messagesContainer = document.getElementById("chat-messages");
        this.chatInput = document.getElementById("chat-input");
        this.chatSendButton = document.getElementById("chat-send");

        this.timer = null;
        this.worldName = "";

        // Listeners
        this.canvas.addEventListener("draw", () => {});
        this.canvas.addEventListener("blockChange", () => {});
        this.canvas.addEventListener("iconChange", () => {});

        console.log("Loaded player \""+ this.playerName +"\" <Game>");
    }

    init() {
        var self = this;

        this.initBackground();
        this.initTextures();
        this.initIcon();
        this.initPlayer();
        this.initCommand();

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

        if(window.location.search.indexOf("?map=") != -1) { // solo map mode
            this.loadLevel();
        } else if(window.location.search.indexOf("?server=") != -1) { // server mode
            var clientPluginScript = document.createElement("script");
            clientPluginScript.src = "./plugins/client.js";
            document.body.appendChild(clientPluginScript);
        }

        console.log("ICraft Inited. fps: "+ this.fps +" <Game.init>");
    }

    initBackground() {
        var grd = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        grd.addColorStop(0, "rgb(218, 237, 254)");
        grd.addColorStop(0.5, "white");
        grd.addColorStop(1, "white");

        this.ctx.fillStyle = grd;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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

        console.log("Textures Inited. <Game.initTextures>");
    }

    initIcon() {
        document.getElementById("icon").src = this.iconPath;

        console.log("Icon Inited. <Game.initIcon>");
    }

    initPlayer() {
        document.body.addEventListener("keydown", (e) => { // control moving
            var px = this.renderer.player.x;
            var py = this.renderer.player.y;

            switch(e.key) {
                case " ":
                    this.resetPlayerTexture();
                    if(this.renderer.player.y > 0 && this.renderer.map[this.getRealPosition(py - this.renderer.blockSize / 2)][this.getRealPosition(px)] instanceof BlockAir) {
                        this.renderer.player.y -= 2;
                        this.isPlayerWalking = false;
                    }
                    break;
                case "w":
                    this.resetPlayerTexture();
                    if(this.renderer.player.y > 0 && this.renderer.map[this.getRealPosition(py - this.renderer.blockSize / 2)][this.getRealPosition(px)] instanceof BlockAir) {
                        this.renderer.player.y -= 2;
                        this.isPlayerWalking = false;
                    }
                    break;
                case "a":
                    this.isPlayerWalking = true;
                    this.renderer.player.direction = this.renderer.playerDirection.LEFT;
                    if(this.renderer.player.x > 0 && this.renderer.map[this.getRealPosition(py)][this.getRealPosition(px - this.renderer.blockSize / 2)] instanceof BlockAir && this.renderer.map[this.getRealPosition(py + this.renderer.blockSize)][this.getRealPosition(px - this.renderer.blockSize / 2)] instanceof BlockAir) {
                        this.renderer.player.x -= 2;
                    }
                    break;
                case "s":
                    this.resetPlayerTexture();
                    if(this.renderer.player.y < this.canvas.height - this.renderer.blockSize * 2 && this.renderer.map[this.getRealPosition(py + this.renderer.blockSize * 2 - this.renderer.blockSize / 2)][this.getRealPosition(px)] instanceof BlockAir) {
                        this.renderer.player.y += 2;
                    }
                    break;
                case "d":
                    this.isPlayerWalking = true;
                    this.renderer.player.direction = this.renderer.playerDirection.RIGHT;
                    if(this.renderer.player.x < this.canvas.width - this.renderer.blockSize && this.renderer.map[this.getRealPosition(py)][this.getRealPosition(px + this.renderer.blockSize - this.renderer.blockSize / 2)] instanceof BlockAir && this.renderer.map[this.getRealPosition(py + this.renderer.blockSize)][this.getRealPosition(px + this.renderer.blockSize - this.renderer.blockSize / 2)] instanceof BlockAir) {
                        this.renderer.player.x += 2;
                    }
                    break;
            }
        });
        document.body.addEventListener("keyup", () => { // stop moving
            this.isPlayerWalking = false;
            this.resetPlayerTexture();
        });
        setInterval(() => { // change player walking texture
            if(this.isPlayerWalking) {
                var dir;
                switch(this.renderer.player.direction) {
                    case this.renderer.playerDirection.LEFT:
                        dir = "left";
                        break;
                    case this.renderer.playerDirection.RIGHT:
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

    resetPlayerTexture() {
        switch(this.renderer.player.direction) {
            case this.renderer.playerDirection.LEFT:
                this.renderer.player.texture = this.renderer.getTexture("texture:player_stand_left");
                break;
            case this.renderer.playerDirection.RIGHT:
                this.renderer.player.texture = this.renderer.getTexture("texture:player_stand_right");
                break;
        }
    }

    resetPlayerPosition() {
        this.renderer.player.x = this.renderer.player.y = 0;
    }

    buttonClick(blockElem) {
        switch(blockElem.getAttribute("data-block")) {
            case "$music":
                if(!this.isMusicPlaying) {
                    document.getElementById("source:music").play();
                    this.isMusicPlaying = true;
                } else {
                    document.getElementById("source:music").pause();
                    this.isMusicPlaying = false;
                }
                break;
            case "$icon":
                this.setIcon(prompt("图标地址(URL)"));
                break;
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
            alert("保存成功");

            console.log("Level Saved. <Game.saveLevel>");
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
                        this.renderer.map[y][x] = new window.blocks["oak_door"](level[num].replace("oak_door_", ""), this.renderer, x, y);
                    } else {
                        this.renderer.map[y][x] = new window.blocks[level[num]](this.renderer, x, y);
                    }
                    num++;
                }
            }

            this.worldName = mapPath.replace(".cmworld", "");
    
            console.log("Level Loaded. <Game.loadLevel>");
            console.log("Level data: ", level);
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
    
            console.log("Setted. icon path: "+ this.iconPath +" <Game.setIcon>");
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

                console.log("Plugin Loaded as BlobURL. <Game.loadPlugin>");
            };
        };
    }

    setFps(fps) {
        this.fps = fps;

        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.renderer.update();
        }, 1000 / this.fps);

        console.log("Setted. fps: "+ this.fps +" <Game.setFps>");
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
}
