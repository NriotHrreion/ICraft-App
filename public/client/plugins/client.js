class MutiplayerClientPlugin extends PluginBase {
    constructor() {
        super();

        this.pluginDetail = {
            name: "Mutiplayer Client",
            description: "For mutiplayer (By NriotHrreion)"
        };

        this.params = window.location.search.replace("?", "").split("&");
        this.playerName = this.params[1].replace("player=", "");
        this.ws = new WebSocket("ws://"+ this.params[0].replace("server=", ""));
        this.token = this.game.getRandom(100000, 999999);
        /** @type {HTMLDialogElement} */
        this.chatContainer = this.game.chatContainer;
        this.messagesContainer = this.game.messagesContainer;
        this.chatInput = this.game.chatInput;
        this.chatSendButton = this.game.chatSendButton;
        this.isChatting = false;
        this.isError = false;

        this.init();
        this.initEvents();
    }

    init() {
        document.getElementById("btn-quit").style.display = "none";
        document.getElementById("btn-plugin").style.display = "none";
        document.getElementById("btn-reset").style.display = "none";

        this.addListener("draw", (e) => {
            this.ws.send(JSON.stringify({
                type: "blockPlace",
                data: {
                    posX: e.detail.position[1],
                    posY: e.detail.position[0],
                    block: e.detail.blockName
                }
            }));
        });
        this.addListener("undraw", (e) => {
            this.ws.send(JSON.stringify({
                type: "blockBreak",
                data: {
                    posX: e.detail.position[1],
                    posY: e.detail.position[0]
                }
            }));
        });
        this.addListener("playerMove", (e) => {
            this.ws.send(JSON.stringify({
                type: "playerMove",
                data: {
                    posX: e.detail.position[1],
                    posY: e.detail.position[0],
                    texture: e.detail.texture.id,
                    player: e.detail.player
                }
            }));
        });

        this.chatSendButton.addEventListener("click", () => {
            var message = this.chatInput.value;
            this.ws.send(JSON.stringify({
                type: "chatMessage",
                data: {
                    playerName: this.playerName,
                    message: message
                }
            }));
            this.chatInput.value = "";
        });
        this.chatInput.addEventListener("keydown", (e) => {
            if(e.key == "Enter") {
                var message = this.chatInput.value;
                this.ws.send(JSON.stringify({
                    type: "chatMessage",
                    data: {
                        playerName: this.playerName,
                        message: message
                    }
                }));
                this.chatInput.value = "";
            }
        });
    }

    initEvents() {
        this.register("button", {
            name: "退出服务器",
            onclick: () => {
                this.ws.send(JSON.stringify({
                    type: "leaveServer",
                    data: {
                        playerName: this.playerName
                    }
                }));
                window.history.back(-1);
            }
        });
        this.ws.onopen = () => {
            this.ws.send(JSON.stringify({
                type: "joinServer",
                data: {
                    playerName: this.playerName
                }
            }));
            Log.info("Server Connected. <WebSocket.onopen>");

            this.fetchPlayerList();
        };
        this.ws.onclose = () => {
            Log.info("Server Closed. <WebSocket.onclose>");
            if(!this.isError) {
                alert("服务器已关闭");
                window.history.back(-1);
            }
        };
        this.ws.onerror = () => {
            this.isError = true;

            Log.info("Server Error. <WebSocket.onerror>");
            alert("无法连接到服务器");
            window.history.back(-1);
        };
        this.ws.onmessage = (e) => {
            var msg = JSON.parse(e.data);
            
            // eslint-disable-next-line default-case
            switch(msg.type) {
                case "mapData":
                    this.game.loadMap(msg.data);
                    break;
                case "chatMessage":
                    this.displayMessage(msg.data.playerName, msg.data.message, msg.data.time);
                    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
                    break;
                case "playerJoin":
                    this.displayServerMessage(msg.data.playerName +" joined the server", msg.data.time);
                    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
                    this.fetchPlayerList();
                    break;
                case "playerLeave":
                    this.displayServerMessage(msg.data.playerName +" left the server", msg.data.time);
                    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
                    this.fetchPlayerList();
                    break;
                case "playerMove":
                    if(msg.data.playerName != this.game.playerName) {
                        var player = this.game.getPlayer(msg.data.playerName);
                        player.pos.x = msg.data.position[1];
                        player.pos.y = msg.data.position[0];
                        player.texture = this.game.renderer.getTexture(msg.data.texture);
                    }
                    break;
                case "playerList-"+ this.token:
                    this.game.players = [];

                    for(let i in msg.data.list) {
                        if(msg.data.list[i] != undefined) {
                            var p = this.game.addPlayer(msg.data.list[i].playerName);
                            p.setPosition(msg.data.list[i].x, msg.data.list[i].y);
                        }
                    }
                    break;
            }
        };
    }

    displayMessage(playerName, message, time) {
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

    displayServerMessage(message, time) {
        var messageBlock = document.createElement("div");
        messageBlock.className = "message";
        var infoLabel = document.createElement("span");
        infoLabel.innerText = time;
        messageBlock.appendChild(infoLabel);
        var messageText = document.createElement("p");
        messageText.innerText = message;
        messageBlock.appendChild(messageText);
        this.messagesContainer.appendChild(messageBlock);
    }

    fetchPlayerList() {
        this.ws.send(JSON.stringify({
            type: "playerList",
            data: {
                token: this.token
            }
        }));
        Log.info("Fetching Player List... <WebSocket.onopen>");
    }
}

var client = new MutiplayerClientPlugin();
