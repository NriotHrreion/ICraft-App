/* eslint-disable default-case */
/**
 * @class
 * @author NriotHrreion
 * @classdesc A base for the ICraft's plugin
 * 
 * @example
 * class ExamplePlugin extends PluginBase {
 *   constructor() {
 *     super();
 *     
 *     this.pluginDetail = {
 *       name: "example plugin",
 *       description: "an example plugin"
 *     }
 * 
 *     // ...
 *   }
 * }
 * 
 * @access public
 */
class PluginBase {
    /** @constructor */
    constructor() {
        /** @type {Game} */
        this.game = game;
        /** @type {Render} */
        this.renderer = this.game.renderer;
        /** @type {{name : string, description : string}} */
        this.pluginDetail = {
            name: "",
            description: ""
        };
    }
    
    /**
     * Add an event listener to **ICraft**
     * 
     * @param {"draw" | "blockChange" | "iconChange"} name Listener Name
     * @param {(e : {detail? : object})} callback Listener Callback
     * 
     * @example
     * this.addListener("draw", (e) => {
     *   // ...
     * });
     * 
     * @access public
     */
    addListener(name, callback) {
        this.game.canvas.addEventListener(name, callback);
    }

    /**
     * Set the info text
     * 
     * @param {string} text Info Text
     * 
     * @example
     * this.setInfoText("HelloWorld");
     * 
     * @access public
     */
    setInfoText(text) {
        document.getElementById("info").innerHTML = text;
    }

    /**
     * Set a block in the map
     * 
     * @param {number} x Block PositionX
     * @param {number} y Block PositionY
     * @param {string} blockName Block Name
     * 
     * @example
     * this.setBlock(1, 1, "bedrock");
     * 
     * @access public
     */
    setBlock(x, y, blockName) {
        this.renderer.map[y][x] = new window.blocks[blockName](this);
    }

    /**
     * Register something to **ICraft**
     * 
     * @param {"block" | "button"} type Type of Register Object
     * @param {*} obj Object
     * 
     * @example
     * class ExampleBlock {
     *   // ... the codes of your block
     * }
     * 
     * this.register("block", ExampleBlock);
     * this.register("button", {name: "info", onclick: function() {
     *   // ...
     * }});
     * 
     * @access public
     */
    register(type, obj) {
        switch(type) {
            case "block":
                window.blocks[obj.getName()] = obj;
                this.game.initTextures();
                break;
            case "button":
                var buttonList = document.getElementById("button-list");
                var button = document.createElement("button");
                button.className = "control-btn";
                button.innerText = obj.name;
                button.setAttribute("data-block", "$plugin-button");
                button.addEventListener("click", (e) => obj.onclick(e));
                buttonList.appendChild(button);
                break;
        }
    }
}
