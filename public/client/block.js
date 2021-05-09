// Define Blocks

class BlockStone {
    constructor(renderer) {
        this.color = "#9e9e9e";
        this.texture = "texture:stone";
        this.blockName = "stone";
    }

    static getName() {
        return "stone";
    }

    static getTexture() {
        return "texture:stone";
    }
}

class BlockSand {
    constructor(renderer) {
        this.color = "#e5c07b";
        this.texture = "texture:sand";
        this.blockName = "sand";
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

    static getName() {
        return "dirt";
    }

    static getTexture() {
        return "texture:dirt";
    }
}

class BlockGrassBlock {
    constructor(renderer) {
        this.color = "#623408";
        this.texture = "texture:grass_block";
        this.blockName = "grass_block";
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

    static getName() {
        return "oak_planks";
    }

    static getTexture() {
        return "texture:oak_planks";
    }
}

class BlockOakDoor {
    constructor(part) {
        this.color = "#623408";
        this.texture = "";
        this.blockName = "";
        this.part = part;

        switch(part) {
            case "top":
                this.texture = "texture:oak_door_top";
                this.blockName = "oak_door_top";
                break;
            case "bottom":
                this.texture = "texture:oak_door_bottom";
                this.blockName = "oak_door_bottom";
                break;
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
    constructor() {
        this.color = "#623408";
        this.texture = "texture:oak_sapling";
        this.blockName = "oak_sapling";
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
