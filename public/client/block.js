// Define Blocks

class BlockStone {
    constructor(renderer) {
        this.color = "#9e9e9e";
        this.texture = "texture:stone";
        this.blockName = "stone";
    }

    update() {}
    
    static getName() {
        return "stone";
    }

    static getTexture() {
        return "texture:stone";
    }
}

class BlockSand {
    constructor(renderer, x, y) {
        this.color = "#e5c07b";
        this.texture = "texture:sand";
        this.blockName = "sand";
        this.renderer = renderer;
        this.posX = x;
        this.posY = y;
    }

    update() {
        var map = this.renderer.map;
        if(map[this.posY + 1][this.posX].blockName == "air") {
            this.renderer.map[this.posY + 1][this.posX] = new BlockSand(this.renderer, this.posX, this.posY + 1);
            this.renderer.map[this.posY][this.posX] = new BlockAir(this.renderer);
        }
    }
    
    static getName() {
        return "sand";
    }

    static getTexture() {
        return "texture:sand";
    }
}

class BlockDirt {
    constructor(renderer) {
        this.color = "#623408";
        this.texture = "texture:dirt";
        this.blockName = "dirt";
    }

    update() {}
    
    static getName() {
        return "dirt";
    }

    static getTexture() {
        return "texture:dirt";
    }
}

class BlockGrassBlock {
    constructor(renderer, x, y) {
        this.color = "#623408";
        this.texture = "texture:grass_block";
        this.blockName = "grass_block";
        this.renderer = renderer;
        this.posX = x;
        this.posY = y;
    }

    update() {
        var map = this.renderer.map;
        var topBlock = map[this.posY - 1][this.posX];

        if(topBlock.blockName != "air" && topBlock.blockName != "oak_sapling") {
            this.renderer.map[this.posY][this.posX] = new BlockDirt(this.renderer, this.posX, this.posY);
        }
    }
    
    static getName() {
        return "grass_block";
    }

    static getTexture() {
        return "texture:grass_block";
    }
}

class BlockOakLog {
    constructor() {
        this.color = "#623408";
        this.texture = "texture:oak_log";
        this.blockName = "oak_log";
    }

    update() {}
    
    static getName() {
        return "oak_log";
    }

    static getTexture() {
        return "texture:oak_log";
    }
}

class BlockOakPlanks {
    constructor() {
        this.color = "#623408";
        this.texture = "texture:oak_planks";
        this.blockName = "oak_planks";
    }

    update() {}
    
    static getName() {
        return "oak_planks";
    }

    static getTexture() {
        return "texture:oak_planks";
    }
}

class BlockOakDoor {
    constructor(part, renderer, x, y) {
        this.color = "#623408";
        this.texture = "texture:oak_door_"+ part;
        this.blockName = "oak_door_"+ part;
        this.part = part;
        this.renderer = renderer;
        this.posX = x;
        this.posY = y;
    }

    update() {
        var map = this.renderer.map;
        var topBlock = map[this.posY - 1][this.posX];

        if(map[this.posY + 1][this.posX].blockName == "air") {
            this.renderer.map[this.posY][this.posX] = new BlockAir(this.renderer);
            this.renderer.map[this.posY - 1][this.posX] = new BlockAir(this.renderer);
        }

        if(topBlock.blockName == "air" && this.part == "bottom") {
            this.renderer.map[this.posY - 1][this.posX] = new BlockOakDoor("top", this.renderer, this.posX, this.posY);
        } else if(((topBlock.blockName != "air" && !(topBlock instanceof BlockOakDoor)) || topBlock.blockName == "oak_door_bottom") && this.part == "bottom") {
            this.renderer.map[this.posY][this.posX] = new BlockAir(this.renderer);
        }
    }
    
    static getName() {
        return "oak_door";
    }

    static getTexture() {
        return "texture:oak_door_top";
    }
}

class BlockOakSapling {
    constructor(renderer, x, y) {
        this.color = "#623408";
        this.texture = "texture:oak_sapling";
        this.blockName = "oak_sapling";
        this.renderer = renderer;
        this.posX = x;
        this.posY = y;
    }

    update() {
        var map = this.renderer.map;
        if(map[this.posY + 1][this.posX].blockName != "grass_block") {
            this.renderer.map[this.posY][this.posX] = new BlockAir(this.renderer);
        }
    }
    
    static getName() {
        return "oak_sapling";
    }

    static getTexture() {
        return "texture:oak_sapling";
    }
}

class BlockGlass {
    constructor() {
        this.color = "#ffffff";
        this.texture = "texture:glass";
        this.blockName = "glass";
    }

    update() {}
    
    static getName() {
        return "glass";
    }

    static getTexture() {
        return "texture:glass";
    }
}

class BlockStoneBricks {
    constructor() {
        this.color = "#9e9e9e";
        this.texture = "texture:stone_bricks";
        this.blockName = "stone_bricks";
    }

    update() {}
    
    static getName() {
        return "stone_bricks";
    }

    static getTexture() {
        return "texture:stone_bricks";
    }
}

class BlockCraftingTable {
    constructor() {
        this.color = "#623408";
        this.texture = "texture:crafting_table";
        this.blockName = "crafting_table";
    }

    update() {}
    
    static getName() {
        return "crafting_table";
    }

    static getTexture() {
        return "texture:crafting_table";
    }
}

class BlockFurnace {
    constructor() {
        this.color = "#9e9e9e";
        this.texture = "texture:furnace";
        this.blockName = "furnace";
    }

    update() {}
    
    static getName() {
        return "furnace";
    }

    static getTexture() {
        return "texture:furnace";
    }
}

class BlockChest {
    constructor() {
        this.color = "#623408";
        this.texture = "texture:chest";
        this.blockName = "chest";
    }

    update() {}
    
    static getName() {
        return "chest";
    }

    static getTexture() {
        return "texture:chest";
    }
}

class BlockObsidian {
    constructor() {
        this.color = "#000000";
        this.texture = "texture:obsidian";
        this.blockName = "obsidian";
    }

    update() {}
    
    static getName() {
        return "obsidian";
    }

    static getTexture() {
        return "texture:obsidian";
    }
}

class BlockBedrock {
    constructor() {
        this.color = "#9e9e9e";
        this.texture = "texture:bedrock";
        this.blockName = "bedrock";
    }

    update() {}
    
    static getName() {
        return "bedrock";
    }

    static getTexture() {
        return "texture:bedrock";
    }
}

class BlockAir {
    constructor(renderer) {
        this.color = "transparent";
        this.blockName = "air";
    }

    update() {}
    
    static getName() {
        return "air";
    }

    static getColor() {
        return "transparent";
    }
}

/** @global */
window.blocks = {};

window.blocks["stone"] = BlockStone;
window.blocks["sand"] = BlockSand;
window.blocks["dirt"] = BlockDirt;
window.blocks["grass_block"] = BlockGrassBlock;
window.blocks["oak_log"] = BlockOakLog;
window.blocks["oak_planks"] = BlockOakPlanks;
window.blocks["oak_door"] = BlockOakDoor;
window.blocks["oak_sapling"] = BlockOakSapling;
window.blocks["glass"] = BlockGlass;
window.blocks["stone_bricks"] = BlockStoneBricks;
window.blocks["crafting_table"] = BlockCraftingTable;
window.blocks["furnace"] = BlockFurnace;
window.blocks["chest"] = BlockChest;
window.blocks["obsidian"] = BlockObsidian;
window.blocks["bedrock"] = BlockBedrock;
window.blocks["air"] = BlockAir;
