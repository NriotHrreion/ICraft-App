class MutiplayerClientPlugin extends PluginBase {
    constructor() {
        super();

        this.pluginDetail = {
            name: "Mutiplayer Client",
            description: "For mutiplayer (By NriotHrreion)"
        };

        this.init();
    }

    init() {
        this.addListener("draw", (e) => {
            this.postData("http://localhost:3722/postBlockData", "posX="+ e.detail.position[1] +"&posY="+ e.detail.position[0] +"&blockName="+ e.detail.blockName);
        });

        setInterval(() => {
            this.getData("http://localhost:3722/getMapData", (data) => {
                var level = data.replace("[", "").replace("]", "").split(",");

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
            });
        }, 200);
    }

    getData(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.send(null);
        xhr.onload = () => {
            callback(xhr.responseText);
        };
    }

    postData(url, body) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(body);
    }
}

var client = new MutiplayerClientPlugin();
