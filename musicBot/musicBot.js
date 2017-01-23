/*
Copyright 2017 ChickenStorm


This file is part of Chicken Bot.

    Foobar is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Chicken Bot is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with Chicken Bot.  If not, see <http://www.gnu.org/licenses/>.

*/


"use strict";

var path = require("path");

const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 0.2 };


var DiscordClient = require('discord.js'); // API discord
var serverUtils =  require(path.join(__dirname, '/../','data/servers.js'));


var bot = new DiscordClient.Client();
var allBotArrayModules;
exports.bot = bot; // set by ref ? 

var asylambaServer;



var play = function(url){
    // TODO refaire proporement
    console.log(url)
    var voiceConnection = bot.voiceConnections.array()[0];
    voiceConnection.on("debug", (m) => console.log("[voiceConnection : debug]", m));
    voiceConnection.on("warn", (m) => console.log("[voiceConnection : warn]", m));
    
    const stream = ytdl(url, {filter : 'audioonly',quality:'lowest'});
    const dispatcher = voiceConnection.playStream(stream, streamOptions);
    
    dispatcher.on("debug", (m) => console.log("[dispatcher debug]", m));
    dispatcher.on("warn", (m) => console.log("[dispatcher warn]", m));
    dispatcher.on("error", (m) => console.log("[dispatcher error]", m));
    dispatcher.on("end", (m) => console.log("[dispatcher end]", m));
    stream.on("debug", (m) => console.log("[stream debug]", m));
    stream.on("warn", (m) => console.log("[stream warn]", m));
    stream.on("error", (m) => console.log("[stream error]", m));
    stream.on("end", (m) => console.log("[stream end]", m));
    
}

exports.play = play;


function success(token){
   
    console.log("login sucessful ");
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
	if (channelArray[i] instanceof DiscordClient.VoiceChannel && channelArray[i].id =="271333305469763584") {
	    //bot.user.joinVoiceChannel(channelArray[i])
	    channelArray[i].join().then(connection => {
	    //connection.playFile('./music/test.mp4');
	    //const stream = ytdl('https://www.youtube.com/watch?v=zUrSQNSN6_c', {filter : 'audioonly'});
	    //const dispatcher = connection.playStream(stream, streamOptions);
	    
	});
	    
	    
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
    
});

//bot.on("debug", (m) => console.log("[debug]", m));
//bot.on("warn", (m) => console.log("[warn]", m));

