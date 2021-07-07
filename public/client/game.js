/**
 * **ICraft**
 * 
 * @author NriotHrreion
 * @license MIT
 */

class Game {
    constructor(canvas, ctx) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.currentBlock = "stone";
        this.iconPath = "./sources/default_icon.png";
        this.isDrawing = false;
        this.isMusicPlaying = false;
        this.mousePosition = {x: 0, y: 0};
        this.fps = 80;
        this.renderer = new Render(this);

        this.timer = null;
        this.worldName = "";

        // Listeners
        this.canvas.addEventListener("draw", () => {});
        this.canvas.addEventListener("blockChange", () => {});
        this.canvas.addEventListener("iconChange", () => {});
    }

    init() {
        var self = this;

        this.initBackground();
        this.initTextures();
        this.initIcon();

        this.canvas.addEventListener("mousedown", () => this.setDrawing(true));
        this.canvas.addEventListener("mouseup", () => this.setDrawing(false));
        this.canvas.addEventListener("mousemove", (e) => {
            this.mousePosition.x = e.offsetX - this.renderer.blockSize / 2;
            this.mousePosition.y = e.offsetY - this.renderer.blockSize / 2;
        });
        this.canvas.addEventListener("mouseleave", () => {
            this.mousePosition = {x: 0, y: 0};
            this.setDrawing(false);
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
            if(blockList[i].getName() == "air") {
                var button = document.createElement("button");
                button.setAttribute("data-block", "air");
                button.className = "control-btn eraser";
                button.innerHTML = "橡皮擦";
                button.addEventListener("click", function() {
                    self.buttonClick(this);
                });
                blockListElem.appendChild(button);
                continue;
            }

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

    loadLevel() {
        var mapPath = window.location.search.replace("?map=", "");

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
                        this.renderer.map[y][x] = new window.blocks["oak_door"](level[num].replace("oak_door_", ""));
                    } else {
                        this.renderer.map[y][x] = new window.blocks[level[num]](this.renderer);
                    }
                    num++;
                }
            }

            this.worldName = mapPath.replace(".cmworld", "");
    
            console.log("Level Loaded. <Game.loadLevel>");
            console.log("Level data: ", level);
        };
    }

    loadMap(mapData) {
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
                    this.renderer.map[y][x] = new window.blocks[level[num]](this.renderer);
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
}
