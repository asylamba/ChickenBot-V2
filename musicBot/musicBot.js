

"use strict";

var path = require("path");


var DiscordClient = require('discord.js'); // API discord
var serverUtils =  require(path.join(__dirname, '/../','data/servers.js'));


var bot = new DiscordClient.Client();
var allBotArrayModules;
exports.bot = bot; // set by ref ? 

var asylambaServer;


//var email = ""; // email of bot 
//var password = ""; // pass of the bot


function success(token){
   
    console.log("login sucesseful ");
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
    
    var serverList = bot.guilds.array();//
    
    for (var i in serverList){
	if (serverList[i].id ==serverUtils.rootServerId ) {
	    asylambaServer = serverList[i];
	}
    }
    
    var channelArray = asylambaServer.channels.array();
    for (var i in channelArray) {
	if (channelArray[i] instanceof DiscordClient.VoiceChannel && channelArray[i].id =="133286854639222784") {
	    //bot.user.joinVoiceChannel(channelArray[i])
	    channelArray[i].join()
	}
	
    }
    
    var connection = bot.voiceConnection;
    
    
});


var botSendMessage = function(message,channel,options){
    //send message (you can use .then().catch() ..)
    //options is optional
    if (message!= undefined && message!= null) {
	return channel.send(message,options);
    }
    else {
	return channel.send(message);
    }
}

exports.botSendMessage = botSendMessage;


bot.on('ready', function() { // quand le bot est pret
    //setTimeout(function(){exports.exit()},100000);
});



