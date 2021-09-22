/* eslint-disable no-self-assign */
/* eslint-disable eqeqeq */
/* eslint-disable default-case */
/* eslint-disable no-undef */

class Render {
    constructor(game) {
        /** @type {ICraft} */
        this.game = game;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.game.ctx;
        this.blockSize = 20;
        this.map = new Array(this.game.canvas.height / this.blockSize).fill(0);
        /** @type {Player} */
        this.playerObject = this.game.getSelfPlayer();
        this.player = {
            x: this.playerObject.pos.x,
            y: this.playerObject.pos.y,
            direction: this.playerObject.direction,
            texture: this.getTexture("texture:player_stand_right")
        };

        for(let i in this.map) {
            var arr = new Array(this.game.canvas.width / this.blockSize).fill(1);
            for(let j in arr) {
                arr[j] = new BlockAir(this);
            }
            
            this.map[i] = arr;
        }

        Log.info("Renderer Inited. <Render>");
    }

    update() {
        this.clearCanvas();

        var posX = this.getRealPosition(this.game.mousePosition.x), posY = this.getRealPosition(this.game.mousePosition.y);
        
        try {
            var block = this.map[posY][posX];
        } catch(error) {
            Log.warn("Renderer Warning: "+ error +" <Render.update>");

            return;
        }

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

            var eventDraw = new CustomEvent("draw", {detail: {
                position: [posY, posX],
                blockName: this.game.currentBlock
            }});
            this.game.canvas.dispatchEvent(eventDraw);
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

            var eventUndraw = new CustomEvent("undraw", {detail: {
                position: [posY, posX],
                blockName: block
            }});
            this.game.canvas.dispatchEvent(eventUndraw);
        }

        // render player
        for(let i in this.game.players) {
            /** @type {Player} */
            var p = this.game.players[i];
            this.ctx.drawImage(p.texture, p.pos.x, p.pos.y, this.blockSize, 2 * this.blockSize);

            var luNumber = nutils.countWordsNumber(p.name);
            this.ctx.fillStyle = this.game.daynight == DayTime.DAY ? "#000" : "#fff";
            this.ctx.fillText(p.name, p.pos.x - (luNumber.lowerCase * 3.5 + luNumber.upperCase * 6 + luNumber.numbers * 4.5 + luNumber.underline * 3.5) / 2 + 5, p.pos.y - 5);
        }

        document.getElementById("fps").innerText = "fps: "+ this.game.fps;
        document.getElementById("cb").innerHTML = "当前方块: <img src=\""+ this.getTexture("texture:"+ this.game.currentBlock).src +"\"/>";
        
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

        if(this.game.daynight == DayTime.NIGHT) {
            this.ctx.fillStyle = "rgba(2, 2, 2, 0.4)";
            this.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
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
        this.game.setStatusText("重置成功");
        Log.info("Map Resetted. <Render.clearData>");
    }

    getRealPosition(pos) {
        return Math.round(pos / this.blockSize);
    }

    getTexture(textureId) {
        return document.getElementById(textureId);
    }
}
