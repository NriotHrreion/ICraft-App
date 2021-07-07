class Render {
    constructor(game) {
        /** @type {Game} */
        this.game = game;
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.game.ctx;
        this.blockSize = 20;
        this.map = new Array(this.game.canvas.height / this.blockSize).fill(0);

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

        if(this.game.isDrawing) {
            var block = this.map[this.getRealPosition(this.game.mousePosition.y)][this.getRealPosition(this.game.mousePosition.x)];

            if(block instanceof BlockAir && this.game.currentBlock.indexOf("oak_door") != -1) {
                this.map[this.getRealPosition(this.game.mousePosition.y)][this.getRealPosition(this.game.mousePosition.x)] = new window.blocks[this.game.currentBlock]("bottom");
            } else if(block instanceof BlockAir || this.game.currentBlock == "air") {
                this.map[this.getRealPosition(this.game.mousePosition.y)][this.getRealPosition(this.game.mousePosition.x)] = new window.blocks[this.game.currentBlock](this);
            }
            if(block instanceof BlockOakDoor && this.game.currentBlock == "air") {
                switch(block.part) {
                    case "top":
                        this.map[this.getRealPosition(this.game.mousePosition.y) + 1][this.getRealPosition(this.game.mousePosition.x)] = new window.blocks[this.game.currentBlock](this);
                        break;
                    case "bottom":
                        this.map[this.getRealPosition(this.game.mousePosition.y) - 1][this.getRealPosition(this.game.mousePosition.x)] = new window.blocks[this.game.currentBlock](this);
                        break;
                }
            }

            var eventData = new CustomEvent("draw", {detail: {
                position: [this.getRealPosition(this.game.mousePosition.y), this.getRealPosition(this.game.mousePosition.x)],
                blockName: this.game.currentBlock
            }});
            this.game.canvas.dispatchEvent(eventData);
        }

        document.getElementById("fps").innerText = "fps: "+ this.game.fps;
        document.getElementById("cb").innerText = "当前方块: "+ this.game.currentBlock;

        var isSanded = false;

        for(let y = 0; y < this.map.length; y++) {
            for(let x = 0; x < this.map[y].length; x++) {
                try {
                    if(this.map[y + 1][x] instanceof BlockAir && this.map[y][x] instanceof BlockSand && !isSanded) { // gravity is an illusion
                        this.map[y + 1][x] = this.map[y][x];
                        this.map[y][x] = new BlockAir(this);
                        if(!(this.map[y][x + 1] instanceof BlockSand) && !(this.map[y][x - 1] instanceof BlockSand)) {
                            isSanded = true;
                        }
                    }
                    if(!(this.map[y + 1][x] instanceof BlockGrassBlock) && this.map[y][x] instanceof BlockOakSapling) {
                        this.map[y][x] = new BlockAir(this);
                    }
                    if(this.map[y + 1][x] instanceof BlockGrassBlock && !(this.map[y][x] instanceof BlockOakSapling) && !(this.map[y][x] instanceof BlockAir)) {
                        this.map[y + 1][x] = new BlockDirt(this);
                    }
                    if(this.map[y - 1][x] instanceof BlockAir && this.map[y][x] instanceof BlockOakDoor) {
                        if(this.map[y][x].part == "bottom") {
                            this.map[y - 1][x] = new BlockOakDoor("top");
                        }
                    } else if(!(this.map[y - 1][x] instanceof BlockAir) && !(this.map[y - 1][x] instanceof BlockOakDoor) && this.map[y][x] instanceof BlockOakDoor && this.map[y][x].part == "bottom") {
                        this.map[y][x] = new BlockAir(this);
                    }
                } catch(e) {
                    // kasdgffgakjsdhf
                }
                
                if(this.map[y][x] instanceof BlockAir) {
                    this.ctx.fillStyle = this.map[y][x].color;
                    this.ctx.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
                } else {
                    this.ctx.drawImage(document.getElementById(this.map[y][x].texture), x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
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
}
