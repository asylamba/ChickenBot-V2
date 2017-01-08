

"use strict";

var DiscordClient = require('discord.js'); // API discord

var bot = new DiscordClient.Client();

exports.bot = bot; // set by ref ? 

//var email = ""; // email of bot 
//var password = ""; // pass of the bot


function success(token){
    console.log("login sucesseful " +"\n exiting");
    bot.user.setGame("en developpement"),
    bot.user.setPresence("dnd")
    
    setTimeout(function(){process.exit(0)}, 100000);
}

function err(error){
    // handle error
    console.log("Error : " + error +"\n exiting");
    setTimeout(function(){process.exit(0)}, 1000);
    
}


exports.init = function(token){
    bot.login(token).then(success).catch(err);
    
    
}



bot.on('ready', function() { // quand le bot est pret
    console.log()
});


/*switchStatusMessage = function (){ // change le message du bot (sous playing) selon les différents types d'activation
	console.log("refresh status");
	logDebug("status","refresh status");
	if (enable) {
		pendingOperation.addOpperation(function(){
			bot.setPresence({
				idle_since: null,
				game: "Status : enable (online)"
			 });
		});
	}
	else{
		pendingOperation.addOpperation(function(){
			bot.setPresence({
				idle_since: Date.now(),
				game: "Status : disable (online)"
			});
		})
	}
	if (forceEnable) {
		pendingOperation.addOpperation(function(){
			bot.setPresence({
				idle_since: null,
				game: "Status : Force enable (online)"
			});
		})
	}
	if (forceDisable) {
		pendingOperation.addOpperation(function(){
			bot.setPresence({
				idle_since: Date.now(),
				game: "Status : Force disable (online)"
			});
		})
	}
}*/
