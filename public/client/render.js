/* eslint-disable no-self-assign */
/* eslint-disable eqeqeq */
/* eslint-disable default-case */
/* eslint-disable no-undef */

class Render {
    constructor(game) {
        /** @type {Game} */
        this.game = game;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.game.ctx;
        this.blockSize = 20;
        this.map = new Array(this.game.canvas.height / this.blockSize).fill(0);
        /** @enum */
        this.playerDirection = {
            LEFT: 0,
            RIGHT: 1
        };
        this.player = {
            x: 0,
            y: 0,
            direction: this.playerDirection.RIGHT,
            texture: this.getTexture("texture:player_stand_right")
        };

        for(let i in this.map) {
            var arr = new Array(this.game.canvas.width / this.blockSize).fill(1);
            for(let j in arr) {
                arr[j] = new BlockAir(this);
            }
            
            this.map[i] = arr;
        }

        console.log("Renderer Inited. <Render>");
    }

    update() {
        this.clearCanvas();

        var posX = this.getRealPosition(this.game.mousePosition.x), posY = this.getRealPosition(this.game.mousePosition.y);
        var block = this.map[posY][posX];

        if(this.game.isDrawing && !this.game.isCleaning && (this.getRealPosition(this.player.x) != posX || this.getRealPosition(this.player.y) != posY) && (this.getRealPosition(this.player.x) != posX || this.getRealPosition(this.player.y + this.blockSize) != posY)) {
            if(block instanceof BlockAir && this.game.currentBlock.indexOf("oak_door") != -1) {
                this.map[posY][posX] = new window.blocks[this.game.currentBlock]("bottom", this, posX, posY);
            } else if(block instanceof BlockAir || this.game.currentBlock == "air") {
                this.map[posY][posX] = new window.blocks[this.game.currentBlock](this, posX, posY);
            }
            if(block instanceof BlockOakDoor && this.game.currentBlock == "air") {
                switch(block.part) {
                    case "top":
                        this.map[posY + 1][posX] = new window.blocks[this.game.currentBlock](this);
                        break;
                    case "bottom":
                        this.map[posY - 1][posX] = new window.blocks[this.game.currentBlock](this);
                        break;
                }
            }

            var eventData = new CustomEvent("draw", {detail: {
                position: [posY, posX],
                blockName: this.game.currentBlock
            }});
            this.game.canvas.dispatchEvent(eventData);
        } else if(this.game.isCleaning && !this.game.isDrawing) {
            if(!(block instanceof BlockAir)) {
                this.map[posY][posX] = new window.blocks["air"](this);
            }
            if(block instanceof BlockOakDoor) {
                switch(block.part) {
                    case "top":
                        this.map[posY + 1][posX] = new window.blocks["air"](this);
                        break;
                    case "bottom":
                        this.map[posY - 1][posX] = new window.blocks["air"](this);
                        break;
                }
            }

            /** @todo */
            // dispatchEvent undraw
        }

        // render player
        this.ctx.drawImage(this.player.texture, this.player.x, this.player.y, this.blockSize, 2 * this.blockSize);

        // render player's name
        this.ctx.fillStyle = "#000";
        this.ctx.fillText(this.game.playerName, this.player.x - this.blockSize / 2 + 5, this.player.y - 5);

        document.getElementById("fps").innerText = "fps: "+ this.game.fps;
        document.getElementById("cb").innerText = "当前方块: "+ this.game.currentBlock;

        for(let y = 0; y < this.map.length; y++) {
            for(let x = 0; x < this.map[y].length; x++) {
                try {
                    this.map[y][x].update();
                } catch {
                    // kasdgffgakjsdhf
                }
                
                if(this.map[y][x] instanceof BlockAir) {
                    this.ctx.fillStyle = this.map[y][x].color;
                    this.ctx.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
                } else {
                    this.ctx.drawImage(this.getTexture(this.map[y][x].texture), x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
                }
            }
        }
    }

    clearCanvas() {
        this.game.canvas.width = this.game.canvas.width;
        this.game.canvas.height = this.game.canvas.height;

        this.game.initBackground();
    }

    clearData() {
        this.map = new Array(this.game.canvas.height / this.blockSize).fill(0);

        for(let i in this.map) {
            var arr = new Array(this.game.canvas.width / this.blockSize).fill(1);
            for(let j in arr) {
                arr[j] = new BlockAir(this);
            }
            
            this.map[i] = arr;
        }
        
        this.game.initBackground();
        console.log("Map Resetted. <Render.clearData>");
    }

    getRealPosition(pos) {
        return Math.round(pos / this.blockSize);
    }

    getTexture(textureId) {
        return document.getElementById(textureId);
    }
}
