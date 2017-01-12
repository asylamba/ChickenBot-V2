

"use strict";

var DiscordClient = require('discord.js'); // API discord

var bot = new DiscordClient.Client();
var allBotArrayModules;
exports.bot = bot; // set by ref ? 

//var email = ""; // email of bot 
//var password = ""; // pass of the bot


function success(token){
   
    console.log("login sucesseful " +"\n exiting");
    bot.user.setGame("en developpement"),
    bot.user.setPresence("dnd")
    
    
}

function err(error){
    // handle error
    console.log("Error : " + error +"\n exiting");
    setTimeout(function(){allBotArrayModules[1].bot.destroy(),bot.destroy();process.exit(0)}, 1000);
    
}


exports.init = function(token,allBotArrayPara){
    allBotArrayModules = allBotArrayPara;
    bot.login(token).then(success).catch(err);
    //console.log(exports.exit)
    
}



bot.on('ready', function() { // quand le bot est pret
    setTimeout(function(){exports.exit()},100000);
});


exports.exit = function(){
    
    for (var i in allBotArrayModules) {
	allBotArrayModules[i].bot.destroy();
    }
    setTimeout(function(){process.exit(0)},2000);
}
