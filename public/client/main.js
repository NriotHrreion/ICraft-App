/**
 * @type {string}
 * 
 * @readonly
 * @global
 */
const version = "0.4.0";

var info = `
 _____            __ _             _            
/  __ \\          / _| |           (_)           
| /  \\/_ __ __ _| |_| |_ _ __ ___  _ _ __   ___ 
| |   | '__/ _\` |  _| __| '_ \` _ \\| | '_ \\ / _ \\
| \\__/\\ | | (_| | | | |_| | | | | | | | | |  __/
 \\____/_|  \\__,_|_|  \\__|_| |_| |_|_|_| |_|\\___|   %cv${version}  %cBy %cNriotHrreion
                                                
`;

console.log(info, "color:gray", "", "font-weight:bold");

var canvas = document.getElementById("main");
var game = new Game(canvas, canvas.getContext("2d"), window.location.search.replace("?", "").split("&")[1].replace("player=", ""));

game.init(); // init and launch game
