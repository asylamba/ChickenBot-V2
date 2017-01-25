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
const streamOptions = { seek: 0, volume: 0.25 };


var DiscordClient = require('discord.js'); // API discord
var serverUtils =  require(path.join(__dirname, '/../','data/servers.js'));


var bot = new DiscordClient.Client();
var allBotArrayModules;
exports.bot = bot; // set by ref ? 

var asylambaServer;

var CurrentlyPlaying =[];


function playMusicObect(startP,inputTextP,infoP,messageDataP){
    /*
     * Object for storing data about a video / music that teh bot will play
     *
     */
	this.startStreaming = startP;
	this.inputText = inputTextP;
    
	this.message =messageDataP;
	
	this.info = infoP ;
    
    
    
}

var play = function(url,message,rangeP){
    // TODO refaire proporement
    try{
	console.log(url)
	
	var posOfVoiceConnection = 0;
	
	var voiceConnection = bot.voiceConnections.array()[posOfVoiceConnection];
	CurrentlyPlaying[posOfVoiceConnection] = new playMusicObect(Date.now(),url,null,message);
	
	//TODO revoir un peu
	ytdl.getInfo(url,function(err,info){
	    CurrentlyPlaying[posOfVoiceConnection].info = info;
		if (info != undefined && info.title != undefined ) {
			botSendMessage("Now playing : `" + CurrentlyPlaying[posOfVoiceConnection].info.title+"`" ,message.channel);
			console.log(info.length_seconds);
			console.log(info.timestamp)
	    }
	    else{
			console.log(err);
	    }
	    
	    
	});
	
	
	voiceConnection.on("debug", (m) => console.log("[voiceConnection : debug]", m));
	/*voiceConnection.on("warn", (m) => {
	    console.log("[voiceConnection : warn]", m);
	    botSendMessage("The music stop playing ... I will try to restart it for you :thumbup::skin-tone-3:",message.channel)
	});*/
	var stream;
	if (rangeP == undefined || rangeP==null || rangeP=="") {
	    
	    stream= ytdl(url, {filter : 'audioonly',quality:'lowest'});//,range:'1000-1100000'}); //
	    
	}
	else{
	    console.log(rangeP)
	    stream= ytdl(url, {filter : 'audioonly',quality:'lowest',range:rangeP});
	}
	
	stream.on("error", (m) => {
	    var errStreamStopRegExp = new RegExp("Error: read ECONNRESET");
	    
	    if (errStreamStopRegExp.test(m)) {
			var timeOfStop = Date.now();
			console.log("[stream : error] ", m);
			botSendMessage("The music stop playing... ",message.channel);
			// I will try to restart it for you :thumbup::skin-tone-3:
			
			
			//console.log(timeOfStop);
			//console.log(CurrentlyPlaying[posOfVoiceConnection].info);
			if (CurrentlyPlaying[posOfVoiceConnection].info !=null && CurrentlyPlaying[posOfVoiceConnection].info !=undefined){
				var lengthSecond = CurrentlyPlaying[posOfVoiceConnection].info.length_seconds;
				var timestamp = CurrentlyPlaying[posOfVoiceConnection].timestamp;
				if (lengthSecond != undefined && timestamp!= undefined ) {
				//console.log(timeOfStop);
				
				var timeOfPlay = (timeOfStop-CurrentlyPlaying[posOfVoiceConnection].startStreaming)/1000; // in sec
				
				var rangeP2 = parseInt((timeOfPlay/lengthSecond)*timestamp)+"-"+timestamp;
				
				//play(CurrentlyPlaying[posOfVoiceConnection],message,rangep2)
				
				}
			}
			
	    }
	    else{
			console.log("[stream : error] ", m);
			botSendMessage("The music stop playing... Unknown error",message.channel)
	    }
	});
	
	const dispatcher = voiceConnection.playStream(stream, streamOptions);
	
	dispatcher.on("end",function(m){
		// next in the PlayLits
		
	});
	
    }
    catch(e){
	botSendMessage("I couldn't play "+url+"\n"+e,message.channel)
    }
    finally{
	
    }
    
    /*dispatcher.on("debug", (m) => console.log("[dispatcher debug]", m));
    dispatcher.on("warn", (m) => console.log("[dispatcher warn]", m));
    dispatcher.on("error", (m) => console.log("[dispatcher error]", m));
    dispatcher.on("end", (m) => console.log("[dispatcher end]", m));
    stream.on("debug", (m) => console.log("[stream debug]", m));
    stream.on("warn", (m) => console.log("[stream warn]", m));
    
    stream.on("end", (m) => console.log("[stream end]", m));*/
    
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
	    
	    channelArray[i].join().then(connection => {
		//connection.playFile('./music/test.mp4');
		//const stream = ytdl('https://www.youtube.com/watch?v=zUrSQNSN6_c', {filter : 'audioonly'});
		//const dispatcher = connection.playStream(stream, streamOptions);
	    
	    });
	    
	    
	}
	
    }
    
    var connection = bot.voiceConnection;
    
    
});

bot.on('message', function(message) { // quand le bot est pret
    
    //console.log(message.content)
    
    //todo les disable enable ect
    
    for(var i in commandMusic){
	if (commandMusic[i].testInput(message)) {
	    var promise = message.react("👌🏽");
	    promise.then(function(){}).catch((m) => {console.log(m);});
	    
	    commandMusic[i].func(message); // exécute la commande si la condition correcte est verifiée
	    
	    //logDebug("message","command " + message);
	}
    }
    
    
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


















/******************************************/
// user and role test


var isUserOfRole = function(userID,roleID,serverObj){
    // this is  slow but i am not stick with the user list => may write function more rapid
    /**
     * fiunction given a user id and a roleid says if the user has the role on the server
     *
     *
     */
    var userListFactionTemp = serverObj.members.array()
    
    if (userListFactionTemp != undefined) {
		for(var i in userListFactionTemp){
		   
			if (userID ==userListFactionTemp[i].id ) {
				var rolesOfUser = userListFactionTemp[i].roles.array();
				
				for (var j in rolesOfUser){
					
					if (rolesOfUser[j].id == roleID) {
					
					return true;
					}
				}
			}
		}
    }
    return false;
}

var isAdminFunc = function(userID){
    /**
     * return true if the user is an admin
     */
    
    return isUserOfRole(userID,roleUtils.adminRoleId.id,asylambaServer);
}
var isModoFunc = function(userID){
    /**
     * return true if the user is an modo or above
     */
     return isUserOfRole(userID,roleUtils.modoRoleId.id,asylambaServer) || isUserOfRole(userID,roleUtils.adminRoleId,asylambaServer);
}

var isBanFunc = function(userID){
    return isUserOfRole(userID,roleUtils.banRole.id,asylambaServer)
}

var notBotFunction = function(userID){
    return !(bot.user.id == userID);
    
}


/**************************************************************************************/
// command
// pas trouvez le moyen d'y aller modulairement sans faire passer plein de fonction

function commandC(testInputp,funcp,inputDescriptionp,descrp,showHelpp) {
    this.testInput = testInputp; // fonction de test sur l'entrée
    this.func = funcp; // fonction a executer
    this.inputDescription= inputDescriptionp; // aide : affiche l'input demandé
    this.descr = descrp; // aide : afffiche ce que la commande fait
    this.showHelp= showHelpp; // fonction qui détermine si l'aide
}

var truefunc = function(){ // retourne toujours vrai
    return true
}



var testMessageIfFollowedByMentionToBot = function(message,messageToTest){
    /**
     * message : string
     * messageToTest : string
     * test si un message est de la forme "messageToTest @ChickenBot[ ]*"  
     *
     */
    
    var regexpMessage = new RegExp(messageToTest+" <@!"+bot.user.id+">"+"[ ]*");
    if (regexpMessage.test(message) ) {
	return true
    }
    else{
	return false
    }
    
    
    
}

var testMessageIfFollowedByMentionToBotOrAllone = function(message,messageToTest){
    /**
     * message : string
     * messageToTest : string
     * test si un message est de la forme "messageToTest @ChickenBot[ ]*" ou "messageToTest"
     * 
     */
    
    return messageToTest == message || testMessageIfFollowedByMentionToBot(message,messageToTest) ;
    
    
}


var commandPrefix = "!"; // the prefix of all command





var commandMusic = [
    new commandC(
	function(message){
	    
	    var reg = new RegExp('^'+commandPrefix+'play *');
	    if(notBotFunction(message.author.id)&&reg.test(message.content)){
		return true
	    }
	    else{
		return false
	    }
	},
	function(message){
	    var temP = message.content.split(" ")
	    var regBot = new RegExp("<@!"+bot.user.id+">");
	    //var urlToPlay;
	    
	    console.log(temP);
	    //console.log(temP.length);
	   
	    play(temP[1],message);
	    if ( temP.lenght > 2 /*&& regBot.test(temP[1])*/ ) {
		//allBotArrayModules[2].play(temP[2]);
	    }
	    else if(temP.lenght >1) {
		
		//allBotArrayModules[2].play(temP[1]);
		
	    }
	    
	    message.delete(5000);
	   
	    //botSendMessage("\'\"une commande pour les gouverner tous\" ! \' \n - *Oxymore 13.01.2017 à 00h20*",message.channel);
	    //TODO modifier
	},
	commandPrefix+"play url", "play some music",truefunc
    ),
]

exports.commandMusic = commandMusic;
