/**
 * @type {string}
 * 
 * @readonly
 * @global
 */
const version = "0.5.5";

var info = `
_____ _____            __ _   
|_   _/  __ \\          / _| |  
  | | | /  \\/_ __ __ _| |_| |_ 
  | | | |   | '__/ _\` |  _| __|
 _| |_| \\__/\\ | | (_| | | | |_ 
 |___| \\____/_|  \\__,_|_|  \\__|    %cv${version}  %cBy %cNriotHrreion
                                                
`;

console.log(info, "color:gray", "", "font-weight:bold");

var canvas = document.getElementById("main");
var game = new ICraft(canvas, window.location.search.replace("?", "").split("&")[1].replace("player=", ""));

game.main(); // init and launch game
