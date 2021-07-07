var info = `
 _____            __ _             _            
/  __ \\          / _| |           (_)           
| /  \\/_ __ __ _| |_| |_ _ __ ___  _ _ __   ___ 
| |   | '__/ _\` |  _| __| '_ \` _ \\| | '_ \\ / _ \\
| \\__/\\ | | (_| | | | |_| | | | | | | | | |  __/
 \\____/_|  \\__,_|_|  \\__|_| |_| |_|_|_| |_|\\___|   %cv0.3.0  %cBy %cNriotHrreion
                                                
`;

console.log(info, "color:gray", "", "font-weight:bold");

var canvas = document.getElementById("main");
var game = new Game(canvas, canvas.getContext("2d"));

game.init(); // init and launch game
