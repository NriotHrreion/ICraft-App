class BaoguoBlock { // 声明马保国块属性 注意: 注册方块前, 请把方块贴图改为png格式并重命名为方块名
    constructor(renderer, x, y) {
        this.color = "#9e9e9e";
        this.texture = "texture:baoguo";
        this.blockName = "baoguo";
    }

    update() {
        /* 更新函数, 每次渲染时调用 */
    }

    static getName() {
        return "baoguo";
    }

    static getTexture() {
        return "texture:baoguo";
    }
}

class ExamplePlugin extends PluginBase {
    constructor() {
        super();

        this.pluginDetail = { // 插件基本信息
            name: "ExamplePlugin",
            description: "This is an example plugin..."
        };

        this.game; // ICraft游戏对象
        this.renderer; // 渲染对象

        this.init();
        this.setStatusText("Hello World, "+ this.pluginDetail.name); // 在状态栏显示文字信息
    }

    init() {
        this.addListener("draw", (e) => { // 添加事件监听器, 这个事件将在用户在放置方块时触发
            console.log(e.detail.position); // 输出用户当前鼠标所放在的方块的位置 (Array)
            console.log(e.detail.blockName); // 输出用户当前使用的方块 (String)
        });
        this.addListener("blockChange", (e) => { // 添加事件监听器, 这个事件将在用户更改方块时触发
            console.log(e.detail.blockName); // 输出用户更改的方块 (String)
        });
        this.addListener("iconChange", (e) => {
            alert("The icon changed to "+ e.detail.icon);
        });

        this.register("block", BaoguoBlock); // 注册马保国块
        this.register("button", { // 注册Info按钮
            name: "Info", // 按钮名称
            onclick: function() { // 按钮点击事件
                alert("HelloWorld");
            }
        });
    }
}

new ExamplePlugin(); // 运行插件, 没有这句话插件不会运行

/**
 * 接口列表
 * 
 * this.addListener(string name, Function callback) 添加事件监听器
 * this.register(string type, Object obj) 注册对象, type的值参考下方的"注册对象"
 * this.game.setStatusText(string text) 设置状态栏信息
 * this.setBlock(number x, number y, string blockName) 放置方块
 * this.game.saveLevel() 保存存档
 * this.game.loadLevel() 加载存档
 * this.game.setCurrentBlock(string blockName) 设置用户当前使用的方块
 * this.game.setDrawing(boolean isDrawing) 设置用户是否正在放置方块的状态
 * this.game.setIcon(string iconPath) 设置存档图标
 * this.game.setFps(number fps) 设置帧率 取值范围: (0 < fps <= 1000)
 * this.game.addPlayer(string name) 添加玩家角色
 * this.game.removePlayer(string name) 移除玩家角色
 * this.game.getPlayer(string name) 获取玩家角色对象
 * this.game.getSelfPlayer() 获取当前玩家角色对象
 * this.renderer.clearCanvas() 清空当前帧
 * this.renderer.clearData() 清空存档数据
 */

/**
 * 事件列表
 * 
 * 事件监听器可以使用addListener方法创建
 * 
 * draw: 放置方块事件
 * e.detail.position 方块放置位置 (Array)
 * e.detail.blockName 方块名 (string)
 * 
 * undraw: 移除方块事件
 * e.detail.position 被移除方块位置 (Array)
 * e.detail.blockName 被移除方块名 (string)
 * 
 * blockChange: 选择方块
 * e.detail.blockName 方块名 (string)
 * 
 * iconChange: 图标设置
 * e.detail.icon 图标路径 (string)
 * 
 * playerMove: 玩家移动
 * e.detail.position 玩家移动后的位置 (Array)
 * e.detail.texture 玩家当前贴图 (HTMLElement)
 * e.detail.player 玩家名 (string)
 */

/**
 * 注册对象
 * 
 * 你可以使用register方法来注册一个对象
 * 下面的列表是可以注册的东西
 * 
 * block: 方块
 * button: 按钮
 */
