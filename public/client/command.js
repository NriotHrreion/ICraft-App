class Command {
    constructor(game) {
        /** @type {Game} */
        this.game = game;
        /** @type {{name : string, runner : CommandsBase}} */
        this.commands = [];
    }

    register(commandName, commandRunner) {
        var commandObject = {
            name: commandName,
            runner: commandRunner
        };

        this.commands.push(commandObject);
    }

    dispatch(commandName, commandStuff) {
        if(commandName == "help") {
            var helpList = "/help - 帮助列表\n";

            for(let i in this.commands) {
                helpList += "/"+ this.commands[i].name +" - "+ this.commands[i].runner.description +"\n";
            }

            this.game.displayMessage("", helpList);
            return;
        }

        for(let i in this.commands) {
            if(this.commands[i].name == commandName) {
                this.commands[i].runner.onCommand(commandStuff.command, commandStuff.args, commandStuff.args.length, commandStuff.sender);
                return;
            }
        }
    }
}

class CommandsBase {
    constructor(game) {
        /** @type {Game} */
        this.game = game;
        /** @type {Render} */
        this.renderer = game.renderer;
        /** @type {string} */
        this.description = "";
    }

    /**
     * 
     * @param {string} cmd Command
     * @param {string[]} args Command Arguments
     * @param {number} length Length of Arguments
     * @param {string} sender Command Sender
     * @returns {boolean}
     */
    onCommand(cmd, args, length, sender) {}
}

class CommandAbout extends CommandsBase {
    constructor(game) {
        super(game);

        this.description = "关于";
    }

    onCommand(cmd, args, length, sender) {
        this.game.displayMessage("", "ICraft Version: "+ version +" Made by: NriotHrreion & Deed\nCopyright (c) NriotHrreion "+ new Date().getFullYear());
        
        return true;
    }
}

class CommandSay extends CommandsBase {
    constructor(game) {
        super(game);

        this.description = "发送一条消息";
    }

    onCommand(cmd, args, length, sender) {
        this.game.displayMessage("["+ sender +"]", args[1] == undefined ? "" : args[1]);
        
        return true;
    }
}

class CommandMe extends CommandsBase {
    constructor(game) {
        super(game);

        this.description = "告诉别人你的状态";
    }

    onCommand(cmd, args, length, sender) {
        var meInfo = args[1] == undefined ? "" : args[1];
        this.game.displayMessage("", "*"+ sender +" "+ meInfo);
        
        return true;
    }
}

class CommandSuicide extends CommandsBase {
    constructor(game) {
        super(game);

        this.description = "自杀";
    }

    onCommand(cmd, args, length, sender) {
        this.game.resetPlayerPosition();
        
        return true;
    }
}
