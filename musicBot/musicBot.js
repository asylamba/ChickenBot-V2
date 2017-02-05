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
var fs = require('fs');

const ytdl = require('ytdl-core');
var ytdl2 = require('youtube-dl');


const streamOptions = { seek: 0, volume: 0.25 };


var DiscordClient = require('discord.js'); // API discord
var serverUtils =  require(path.join(__dirname, '/../','data/servers.js'));

var path = require("path");
var userList =  require(path.join(__dirname, '/../','data/user.js'));
var serverUtils =  require(path.join(__dirname, '/../','data/servers.js'));
var roleUtils =  require(path.join(__dirname, '/../','data/role.js'));

var bot = new DiscordClient.Client();
var allBotArrayModules;
exports.bot = bot; // set by ref ? 

var asylambaServer;

var CurrentlyPlaying =[];

const musicListFilePath =path.join(__dirname, '/../','data_bot/musicList.json')

var musicList ; // the music Array Object


var playListArray=[];

var playRandomMusicWhenNoMusicIsInThePlayList = true;



// TODO lock objet ?

function PlayListObject(url,guildIdP,channelArrayToResponce){
	
	this.urlToPlayArray=[];
	this.isValidUrlArray=[]; // say if the url at the same pos is a valide video
	
	this.musicInfoArray=[]
	
	this.requesterArray =[];
	
	this.guildId = guildIdP;
	
	
	
	this.isPlaying = false;
	
	this.positionPlayingNext=0;
	
	this.addElementAndDisplayMessage = function(url,channelArrayToResponce,author){
		this.urlToPlayArray.push(url);
		this.isValidUrlArray.push(true);
		this.musicInfoArray.push(null);
		this.requesterArray.push(author);
		var temp = this
		var l = this.musicInfoArray.length-1;
		
		console.log(url)
		
		ytdl2.getInfo(url,[],function(err,info){
			if (info != undefined && info.title != undefined) {
				for(var i in channelArrayToResponce){
					//console.log(info)
					
					botSendMessage("added `"+info.title+"` to the playlist requested by " +author.username +" (<@"+author.id +">)",channelArrayToResponce[i]);
				}
				temp.musicInfoArray[l] = info;
			}
			else{
				temp.isValidUrlArray[l] = false;
			}
		});
	};
	
	this.addElementAndDisplayMessage(url,channelArrayToResponce);
	
}


function MusicListContainer(musiArrayP){
	
	this.musiArray = [];
	
	for(var i in musiArrayP){
		var musicWorking = musiArrayP[i];
		var musicTemp = new MusicObject(musicWorking.url,true);
		
		for (var j in musicWorking) {
			musicTemp[j] = musicWorking[j];
		}
		
		this.musiArray.push(musicTemp);
		
	}
	
	
	this.addMusicToList = function(url){
		
		var boolIsInside = false;
		for(var i in this.musiArray){
			if (this.musiArray[i].url == url) {
				boolIsInside = true;
				break; // to save time
			}
		}
		
		if (!boolIsInside) {
			this.musiArray.push(new MusicObject(url));
			this.saveMusic();
		}
		
	}
	
	this.likeMusic = function(user,url,level){
		for(var i in this.musiArray){
			if (this.musiArray[i].url == url) {
				this.musiArray[i].like(user,level);
			}
		}
	}
	
	this.getRandomMusicBasedOnLikeLevel = function(userArray){
		/**
		 * get a random music based on like level of a liste of user
		 * the more the music il like the more the music has chance to be selectionned
		 *
		 *
		 */
		var likeArrayMusicObject = [];
		var totalLevel = 0;
		for(var i in this.musiArray){
			var level = this.musiArray[i].getLike(userArray);
			if (level > 0 && this.musiArray[i].isValid && ! this.musiArray[i].isBan) { // take only valid non banned music
				
				totalLevel += level;
				likeArrayMusicObject.push({url: this.musiArray[i].url, like:level});
				
			}
		}
		console.log(likeArrayMusicObject);
		if (likeArrayMusicObject.length>0) {
			var randomNumber = Math.random()*(totalLevel);
			var currentLevel =0;
			
			for(var i in likeArrayMusicObject){
				currentLevel += likeArrayMusicObject[i].like;
				if (currentLevel > randomNumber) {
					return likeArrayMusicObject[i].url;
				}
			}
			return null;
			
			
		}
		else{
			return null;
		}
		
	}
	
	this.getLikeLevel = function (url){
		
		var level = 0
		for (var i in this.musiArray){
			if (his.musiArray[i].url == url) {
				level = this.musiArray[i].getTotalLike();
			}
			
			
		}
		
		return level;
	}
	
	
	this.saveMusic = function(callback){
		fs.writeFile(musicListFilePath,JSON.stringify(this.musiArray),callback);
	}
	
}


function MusicObject(url,bypassTest){
	this.url = url;
	this.isValid = true;
	this.info = null;
	
	this.isBan = false;
	
	var temp = this
	
	this.likeArray = [];
	
	if (bypassTest != null && bypassTest!= undefined && bypassTest) {
		
	}
	else{
		ytdl2.getInfo(url,[],function(err,info){
			if (info != undefined && info.title != undefined) {
				
				//temp.info = info;
			}
			else{
				temp.isValid = false;
			}
		});
	}
	
	this.like = function (user,likeLevelP){
		/*
		 * like the music
		 *
		 */
		var pos = -1;
		var hasLike = false;
		for (var i in this.likeArray){
			if (this.likeArray[i].userId == user.id) {
				pos = i;
				hasLike = this.likeArray[i].changeLike(user,likeLevelP);
			}
		}
		if (pos ==-1) {
			this.likeArray.push(new likeObject(user,likeLevelP));
			return true;
		}
		else{
			return hasLike;
		}
		
	}
	
	this.getTotalLike = function(){
		var likeL = 0;
		for (var i in this.likeArray){
			likeL += this.likeArray[i].likeLevel;
		}
		
		
		return likeL;
	}
	
	this.getLike = function(userArray){
		var likeL = 0;
		for (var i in this.likeArray){
			for (var j in userArray){
				if (this.likeArray[i].userId ==userArray[j].id) {
					likeL += this.likeArray[i].likeLevel;
					break; // to save time
				}
			}
			
		}
		
		
		return likeL;
	}
	
	
}

function likeObject(user,likeLevelP) {
	/* ojbect reprensenting a like level of a user
	 *
	 * input:
	 *     - user the discord user
	 *     - likeLevelP an interger representig the like level : 1 like, 0 neutral, -1 dislike
	 * 
	 */
	
	
	
	this.userId = user.id;
	this.likeLevel = likeLevelP;
	
	this.changeLike = function (user,likeLevelP){
		if (user.id == this.userId ) {
			this.likeLevel= likeLevelP;
			return true;
		}
		else{
			return false;
		}
		
	}
	
	
	this.isLike = function(){return this.likeLevel > 0;};
	this.isUnlike = function(){return this.likeLevel < 0;};
	this.isNeutral = function(){return this.likeLevel == 0;};
	
}


function playMusicObect(startP,inputTextP,channelArrayToMessageP,infoP){
    /*
     * Object for storing data about a video / music that teh bot will play
     *
     */
	this.startStreaming = startP;
	this.inputText = inputTextP;
    
	this.channelArrayToMessage =channelArrayToMessageP;
	
	this.info = infoP ;
    
    
    
}


function getPosOfVoiceConnection(guild){
	/*
	 * get the pos of the voice connection associated with the guild
	 * return -1 if it is not in voice connection
	 *
	 */
	var posOfVoiceConnection = -1;
	var voiceConnectionsArray = bot.voiceConnections.array();
	for (var i in voiceConnectionsArray){
		if (voiceConnectionsArray[i].channel.guild.id ==guild.id ) {
			
			posOfVoiceConnection = i;
		}
	}
	
	return posOfVoiceConnection;
	
}

var playMusicAndShowIt = function(url,channelArrayToMessage,guild,rangeP){
	/*
	 * Play a music and send message by the bot to say wich music is played
	 *
	 * input:
	 * 		- url : the url of the video (it could also be the indentifer of the vieo like rWrjwUm3Oi4)
	 * 		- channelArrayToMessage : an array of channel where the bot will send message
	 * 		- rangeP [optional] : the range of the video () in the INT-INT format [NOT WORKING] due to a issie with  ytdl-core
	 * outupt :
	 *      - true : the music has been succesfully start playing
	 *      - false : the music cannot be played
	 */
	
    // TODO refaire proporement
   
	console.log(url)
	
	/*for(var i in playListArray){
		
		if (playListArray[i].guildId == guild.id){
			playListArray[i].isPlaying = true;
		}
	}*/
	
	var posOfVoiceConnection = 0;
	var voiceConnectionsArray =bot.voiceConnections.array();
	var hasVoiceInThisServer = false;
	
	for (var i in voiceConnectionsArray){
		if (voiceConnectionsArray[i].channel.guild.id ==guild.id ) {
			hasVoiceInThisServer = true;
			posOfVoiceConnection = i;
		}
	}
	
	if ( hasVoiceInThisServer ) {
		try{
			var voiceConnection = voiceConnectionsArray[posOfVoiceConnection];
			
			
			
			CurrentlyPlaying[posOfVoiceConnection] = new playMusicObect(Date.now(),url,channelArrayToMessage,null);
			
			//TODO revoir un peu
			
			/*
			 * Old module
			 *
			 *ytdl.getInfo(url,function(err,info){
				CurrentlyPlaying[posOfVoiceConnection].info = info;
				if (info != undefined && info.title != undefined ) {
					for (var i in channelArrayToMessage){
						botSendMessage("Now playing : `" + CurrentlyPlaying[posOfVoiceConnection].info.title+"`" ,channelArrayToMessage[i]);
					}
					//console.log(info.length_seconds);
					//console.log(info.timestamp)
				}
				else{
					console.log(err);
				}
				
				
			});*/
			
			
			//voiceConnection.on("debug", (m) => console.log("[voiceConnection : debug]", m));
			/*voiceConnection.on("warn", (m) => {
				console.log("[voiceConnection : warn]", m);
				botSendMessage("The music stop playing ... I will try to restart it for you :thumbup::skin-tone-3:",message.channel)
			});*/
			
			var stream;
			/* OLD ytdl module
			if (rangeP == undefined || rangeP==null || rangeP=="") {
				
				stream= ytdl(url, {filter : 'audioonly',quality:'lowest'});//,range:'1000-1100000'}); //
				
			}
			else{
				console.log(rangeP)
				//stream= ytdl(url, {filter : 'audioonly',quality:'lowest',range:rangeP}); // DO NOT WORK ! API bug
				stream= ytdl(url, {filter : 'audioonly',quality:'lowest'});
			}
			*/
			
			stream = ytdl2(url,['-x', '--audio-format', 'mp3']);
			
			stream.on('info',function(info){
				CurrentlyPlaying[posOfVoiceConnection].info = info;
				if (info != undefined && info.title != undefined ) {
					for (var i in channelArrayToMessage){
						botSendMessage("Now playing : `" + CurrentlyPlaying[posOfVoiceConnection].info.title+"`" ,channelArrayToMessage[i]);
					}
					//console.log(info.length_seconds);
					//console.log(info.timestamp)
				}
				else{
					console.log(err);
				}
			});
			
			stream.on("error", (m) => {
				var errStreamStopRegExp = new RegExp("Error: read ECONNRESET");
				
				if (errStreamStopRegExp.test(m)) {
					/*
					 *
					 * Old module error
					 *
					 */
					
					
					var timeOfStop = Date.now();
					console.log("[stream : error] ", m);
					for (var i in channelArrayToMessage){
						botSendMessage("The music stop playing... (Common error) ",channelArrayToMessage[i]);
					}
					// I will try to restart it for you :thumbup::skin-tone-3:
					
					
					/* Not used
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
					*/
				}
				else{
					console.log("[stream : error] ", m);
					for (var i in channelArrayToMessage){
						botSendMessage("The music stop playing... Unknown error",channelArrayToMessage[i]);
						console.log(m)
					}
				}
				
				setTimeout(function(){
					//playNextMusic(channelArrayToMessage,guild);
				},1000);
				
			});
			
			stream.on("end",(m) =>{
				
				console.log("end stream "+ m)
				
			})
			
			const dispatcher = voiceConnection.playStream(stream, streamOptions);
			
			dispatcher.on("end",function(m){
				// next in the PlayLits
				console.log("end dispatcher "+ m)
				playNextMusic(channelArrayToMessage,guild);
				
			});
			
			setCorrespondigPlayListToPlaying(playListArray,guild,true);
			
			return true;
		}
		catch(e){
			for (var i in channelArrayToMessage){
				botSendMessage("I couldn't play "+url+"\n"+e,channelArrayToMessage[i]);
			}
			
			setCorrespondigPlayListToPlaying(playListArray,guild,true);
			
			return false;
		}
		finally{
			
		}
	} // then channel does not exist
	else{
		for (var i in channelArrayToMessage){
			botSendMessage("I am not in any voice channel",channelArrayToMessage[i]);
		}
		
		setCorrespondigPlayListToPlaying(playListArray,guild,false);
		
		
		
		return false;
	}
    /*dispatcher.on("debug", (m) => console.log("[dispatcher debug]", m));
    dispatcher.on("warn", (m) => console.log("[dispatcher warn]", m));
    dispatcher.on("error", (m) => console.log("[dispatcher error]", m));
    dispatcher.on("end", (m) => console.log("[dispatcher end]", m));
    stream.on("debug", (m) => console.log("[stream debug]", m));
    stream.on("warn", (m) => console.log("[stream warn]", m));
    
    stream.on("end", (m) => console.log("[stream end]", m));*/
    
}





var setCorrespondigPlayListToPlaying  = function(playListArray,guild,bool){
	for(var i in playListArray){
		
		if (playListArray[i].guildId == guild.id){
			playListArray[i].isPlaying = false;
		}
	}
}


const findPositionOfThePlaylistObject = function (guild){
	/* return the position in playListArray of the playlist of the guild given in input
	 *
	 * retrun -1 if it does not exist
	 *
	 *
	 */
	
	var positionInPlayList=-1;
	
	for(var i in playListArray){
		
		if (playListArray[i].guildId == guild.id){
			positionInPlayList=i;
		}
	}
	
	return positionInPlayList;
}

var addVideoToPlayList = function(url,channelArrayToMessage,guild,author,rangeP){
	
	//var positionInPlayList=-1;
	
	const positionInPlayList = findPositionOfThePlaylistObject(guild);
	
	
	console.log(positionInPlayList)
	
	if (positionInPlayList != -1) {
		//playListArray[positionInPlayList].urlToPlayArray.push(url);
		playListArray[positionInPlayList].addElementAndDisplayMessage(url,channelArrayToMessage,author);
		if (! playListArray[positionInPlayList].isPlaying) {
			playNextMusic(channelArrayToMessage,guild);
		}
	}
	else{
		playListArray.push(new PlayListObject(url,guild.id,channelArrayToMessage,author));
		const positionInPlayList = playListArray.length-1;
		//console.log("a")
		if (! playListArray[positionInPlayList].isPlaying) {
			//console.log("a")
			playNextMusic(channelArrayToMessage,guild);
		}
	}
	
	return true; // todo revoir
}

//exports.play = play;


var playNextMusic = function (channelArrayToMessage,guild){
	
	for(var i in playListArray){
		
		if (playListArray[i].guildId == guild.id){
			
			var boolWhileNotContinue = false;
			var hasEnterWhile = false;
			console.log(playListArray[i].positionPlayingNext)
			console.log(playListArray[i].urlToPlayArray)
			while(!boolWhileNotContinue && playListArray[i].urlToPlayArray.length >  playListArray[i].positionPlayingNext && playListArray[i].isValidUrlArray[playListArray[i].positionPlayingNext]){
				
				
				hasEnterWhile = true;
				var urlToPlay = playListArray[i].urlToPlayArray[playListArray[i].positionPlayingNext];
				
				boolWhileNotContinue = playMusicAndShowIt(urlToPlay,channelArrayToMessage,guild);
				
				console.log("b");
				
				
				++playListArray[i].positionPlayingNext;
			}
			
			if (boolWhileNotContinue && hasEnterWhile) {
				console.log(true)
				playListArray[i].isPlaying = true;
			}
			else{
				console.log(false)
				
				playListArray[i].isPlaying = false;
				
				
				if (playRandomMusicWhenNoMusicIsInThePlayList) {
					
					if (guild.available) {
						
						
						var voiceConnectionTemp = guild.voiceConnection;
						
						if (voiceConnectionTemp != null && voiceConnectionTemp!= undefined) {
							var userArray = voiceConnectionTemp.channel.members.array();
							var urlTemp2 = musicList.getRandomMusicBasedOnLikeLevel(userArray);
							console.log(urlTemp2);
							if (urlTemp2 != null) {
								//playListArray[i].isPlaying = playMusicAndShowIt(urlTemp2,channelArrayToMessage,guild);
								//;
								setTimeout(function(){addVideoToPlayList(urlTemp2,channelArrayToMessage,guild,bot.user)},1000)
							}
							
						}
						
						
					}
				}
				
				/*if ( playListArray[i].isPlaying == false){
					for(var i in channelArrayToMessage){
						botSendMessage("there is no more music to play.",channelArrayToMessage[i])
					}
					
				}
				else{
					for(var i in channelArrayToMessage){
						botSendMessage("there is no more music to play. I chose one that you may like",channelArrayToMessage[i])
					}
				}*/
				
				for(var i in channelArrayToMessage){
					botSendMessage("There is no more music to play. I choose one that you may !like",channelArrayToMessage[i])
				}
				
			}
			
			
		}
		
	}
}

function success(token){
   
    console.log("MusicBot login sucessful ");
    //bot.user.setGame("en developpement"),
    //bot.user.setPresence("dnd")
    
    
}



function err(error){
    // handle error
    console.log("Error : " + error +"\n exiting");
    setTimeout(function(){allBotArrayModules[1].bot.destroy(),bot.destroy();process.exit(0)}, 1000);
    
}


exports.init = function(token,allBotArrayPara){
	console.log("test")
	
    allBotArrayModules = allBotArrayPara;
    
	
	
    fs.readFile(musicListFilePath,'utf8', function (err, data) { // lit la liste des votes
		console.log("test")
		
		musicList = new MusicListContainer(JSON.parse(data.toString('utf8'))); // parse
		bot.login(token).then(success).catch(err);
		
		
		
	});
}


bot.on('ready', function() { // quand le bot est pret
    
	bot.user.setGame("!help");
	
    var serverList = bot.guilds.array();//
    
    for (var i in serverList){
		if (serverList[i].id ==serverUtils.rootServerId ) {
			asylambaServer = serverList[i];
		}
    }
    
    var channelArray = asylambaServer.channels.array();
    for (var i in channelArray) {
		if (channelArray[i] instanceof DiscordClient.VoiceChannel && channelArray[i].id =="271333305469763584") {
			
			//channelArray[i].join().then(connection => {
				
				//connection.playFile('./music/test.mp4');
				//const stream = ytdl('https://www.youtube.com/watch?v=zUrSQNSN6_c', {filter : 'audioonly'});
				//const dispatcher = connection.playStream(stream, streamOptions);
				
			//});
			
			
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
     return isUserOfRole(userID,roleUtils.modoRoleId.id,asylambaServer) || isUserOfRole(userID,roleUtils.adminRoleId.id,asylambaServer);
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
			
			var reg = new RegExp('^'+commandPrefix+'play .*');
			if(notBotFunction(message.author.id)&&reg.test(message.content) && isModoFunc(message.author.id)){
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
			console.log(temP.length);
		   var hasPlayMusic = false;
			
			if ( temP.lenght > 2 && regBot.test(temP[1] )) {
				console.log(temP);
				hasPlayMusic = playMusicAndShowIt(temP[2],[message.channel],message.guild);
				musicList.addMusicToList(temP[2]);
			}
			else if(temP.lenght >1 || true) {
				console.log(temP);
				hasPlayMusic = playMusicAndShowIt(temP[1],[message.channel],message.guild);
				musicList.addMusicToList(temP[1]);
				
			}
			if (hasPlayMusic) {
				message.delete(5000);
			}
			else{
				//message.react("🚫");
			}
			
		   
			//botSendMessage("\'\"une commande pour les gouverner tous\" ! \' \n - *Oxymore 13.01.2017 à 00h20*",message.channel);
			//TODO modifier
		},
		commandPrefix+"play url", "play some music (override) (modo)",function(message){return isModoFunc(message.author.id);}
    ),
	new commandC(
		function(message){
			
			var reg = new RegExp('^'+commandPrefix+'request *');
			if(notBotFunction(message.author.id)&&reg.test(message.content)){
				return true
			}
			else{
				return false
			}
		},
		function(message){
			var voiceConnectionPos =getPosOfVoiceConnection(message.guild)
			if (voiceConnectionPos != -1) {
				
				
				var temP = message.content.split(" ")
				var regBot = new RegExp("<@!"+bot.user.id+">");
				//var urlToPlay;
				
				console.log(temP);
				console.log(temP.length);
				var hasAddedMusic = false;
				
				if ( temP.lenght > 2 && regBot.test(temP[1] )) {
					console.log(temP);
					hasAddedMusic = addVideoToPlayList(temP[2],[message.channel],message.guild,message.author);
					musicList.addMusicToList(temP[2]);
				}
				else if(temP.lenght >1 || true) {
					console.log(temP);
					hasAddedMusic = addVideoToPlayList(temP[1],[message.channel],message.guild,message.author);
					musicList.addMusicToList(temP[1]);
					
				}
				if (hasAddedMusic) {
					//botSendMessage("Added music to playList",message.channel)
					message.delete(5000);
				}
				else{
					//message.react("🚫");
					botSendMessage("error while adding the music to the play list.",message.channel)
				}
			}
			else{
				botSendMessage("I am not in any voice channel",message.channel);
			}
			
		   
			//botSendMessage("\'\"une commande pour les gouverner tous\" ! \' \n - *Oxymore 13.01.2017 à 00h20*",message.channel);
			//TODO modifier
		},
		commandPrefix+"request url", "request a video and add it to the playlist",function(message){return isModoFunc(message.author.id);}
    ),
	new commandC(
		function(message){
			
			var reg = new RegExp('^'+commandPrefix+'[jJ]oin[Vv]oice[ ]*$');
			if(notBotFunction(message.author.id)&&reg.test(message.content)){
				return true
			}
			else{
				return false
			}
		},
		function(message){
			
			
			var author = message.author;
			var guild = message.guild;
			var chanArray = guild.channels.array();
			var hasFindUser = false;
			var hasFindMeConnected;
			
			if (guild.voiceConnection == null || guild.voiceConnection == undefined) {
				hasFindMeConnected = false;
			}
			else{
				hasFindMeConnected = true;
			}
			
			var voiceChanToConnect;
			
			if (!hasFindMeConnected || isModoFunc(author.id)) {
				//the modo can force bot to move ?
				
				for (var i in chanArray) {
					if (chanArray[i] instanceof DiscordClient.VoiceChannel) {
						var members = chanArray[i].members.array();
						
						for(var j in members){
							if (members[j].id == author.id) {
								hasFindUser = true;
								voiceChanToConnect = chanArray[i];
								//break; // we can break here for saving time
								// the code does not fondamently chnage if you remove this break it is juste for saving time
							}
						}
						
					}
					if (hasFindUser) {
						//break;// we can break here for saving time
						// the code does not fondamently chnage if you remove this break it is juste for saving time
					}
				}
				
				if (hasFindUser) {
					voiceChanToConnect.join().then(connection =>{
						if (hasFindMeConnected && isAdminFunc(author.id)) {
							botSendMessage("Beloved administrator, I sucessfuly move to your channel.",message.channel);
						}
						else if (hasFindMeConnected && isModoFunc(author.id)) {
							botSendMessage("Beloved moderator, I sucessfuly move to your channel.",message.channel);
						}
						else{
							botSendMessage("I sucessfuly join your channel.",message.channel);
						}
					}).catch(error=> {
						botSendMessage("I cannot join your channel : "+ error+".",message.channel);
					});
				}
				else{
					botSendMessage("Your are not connected to a voice channel, please connect frist and redo this commande.",message.channel);
				}
			}
			else{
				botSendMessage("I am already playng in a other channel, please use !leaveVoice before adding me to a new channel.",message.channel);
			}
			
			
		},
		commandPrefix+"joinVoice", "Join the voice channel your are in (and for modo : force moving the bot)",truefunc
    ),
	new commandC(
		function(message){
			
			var reg = new RegExp('^'+commandPrefix+'[lL]eave[Vv]oice[ ]*$');
			if(notBotFunction(message.author.id)&&reg.test(message.content) ){
				return true
			}
			else{
				return false
			}
		},
		function(message){
			
			var guild = message.guild;
			
			
			
			
			if (guild.voiceConnection == null || guild.voiceConnection == undefined) {
				botSendMessage("I am not in any chanel on this guid.",message.channel);
			}
			else{
				guild.voiceConnection.channel.leave();
				botSendMessage("I leave the channel.",message.channel);
				
				
			}
		   
			//botSendMessage("\'\"une commande pour les gouverner tous\" ! \' \n - *Oxymore 13.01.2017 à 00h20*",message.channel);
			//TODO modifier
		},
		commandPrefix+"leaveVoice", "disconect form the current voiceChannel",truefunc
    ),
	new commandC(
		function(message){
			
			var reg = new RegExp('^'+commandPrefix+'[sS]kip[ ]*$');
			if(notBotFunction(message.author.id)&&reg.test(message.content) ){
				return true
			}
			else{
				return false
			}
		},
		function(message){
			var voiceConnectionPos =getPosOfVoiceConnection(message.guild)
			if (voiceConnectionPos != -1) {
				botSendMessage("Skiping music.",message.channel);
				playNextMusic([message.channel],message.guild);
			}
			//botSendMessage("\'\"une commande pour les gouverner tous\" ! \' \n - *Oxymore 13.01.2017 à 00h20*",message.channel);
			//TODO modifier
		},
		commandPrefix+"skip", "skip the current music and passes to the next",truefunc
    ),
	new commandC(
		function(message){
			
			const reg = new RegExp('^'+commandPrefix+'[Pp]lay[Ll]ist[ ]*$');
			if(notBotFunction(message.author.id)&&reg.test(message.content) ){
				return true
			}
			else{
				return false
			}
		},
		function(message){
			
			
			const posPlaylistObj = findPositionOfThePlaylistObject(message.guild);
			
			//playlistGuild = new PlayListObject(a,b);
			if (posPlaylistObj != -1) {
				const playlistGuild =  playListArray[posPlaylistObj];
				console.log(playListArray[posPlaylistObj])
				if (! playlistGuild.isPlaying) {
					botSendMessage("I am not playing rigth now in your channel.",message.channel)
				}
				else if (playlistGuild.positionPlayingNext >= playlistGuild.urlToPlayArray.length) {
					botSendMessage("There is no music after this one",message.channel);
					
				}
				else{
					var messageToSend = "The next music are : ```"
					
					for (var i =playlistGuild.positionPlayingNext ; i< playlistGuild.urlToPlayArray.length;++i){
						if (playlistGuild.isValidUrlArray[i]) {
							
							
							const info = playlistGuild.musicInfoArray[i];
							const urlTemp3 = playlistGuild.musicInfoArray[i].url;
							
							var author = playlistGuild.requesterArray[i];
							
							if (info != null && info != undefined) {
								messageToSend+= "\n - "+(i-playlistGuild.positionPlayingNext+1)+" "+info.title+" --requested by " +author.username +" (<@"+author.id +">)"+"  like:" + musicList.getLikeLevel(urlTemp3);
							}
							else{
								messageToSend+= "\n - "+(i-playlistGuild.positionPlayingNext+1)+" *retriving data* --requested by " +author.username +" (<@"+author.id +">)"+"  like:"+ musicList.getLikeLevel(urlTemp3);
							}
						}
						
					}
					messageToSend += "```\n "
					botSendMessage(messageToSend,message.channel)
				}
			}
			else{
				botSendMessage("I am not playing rigth now in your channel.",message.channel)
			}
			
		},
		commandPrefix+"playlist", "Show the current playlist",truefunc
    ),
	
	
	new commandC(
		function(message){
			
			var reg = new RegExp('^'+commandPrefix+'[lL]ike[ ]*$');
			if(notBotFunction(message.author.id)&&reg.test(message.content) ){
				return true
			}
			else{
				return false
			}
		},
		function(message){
			var voiceConnectionPos =getPosOfVoiceConnection(message.guild)
			const posPlaylistObj = findPositionOfThePlaylistObject(message.guild);
			
			if (voiceConnectionPos != -1 && posPlaylistObj!=-1 ) {
				const playlistGuild =  playListArray[posPlaylistObj];
				
				if (playlistGuild.isPlaying) {
					
					
					var urlTemp  = playlistGuild.urlToPlayArray[playlistGuild.positionPlayingNext-1];
					
					
					
					musicList.likeMusic(message.author,urlTemp,1);
				}
				else{
					botSendMessage("I am not playing music.",message.channel);
				}
			}
			else{
				botSendMessage("I am not playing music.",message.channel);
			}
			
			
		   
			//botSendMessage("\'\"une commande pour les gouverner tous\" ! \' \n - *Oxymore 13.01.2017 à 00h20*",message.channel);
			//TODO modifier
		},
		commandPrefix+"like", "note the current video as like",truefunc
    ),
	new commandC(
		function(message){
			
			var reg = new RegExp('^'+commandPrefix+'[Uu]n[lL]ike[ ]*$');
			if(notBotFunction(message.author.id)&&reg.test(message.content) ){
				return true
			}
			else{
				return false
			}
		},
		function(message){
			var voiceConnectionPos =getPosOfVoiceConnection(message.guild)
			const posPlaylistObj = findPositionOfThePlaylistObject(message.guild);
			
			if (voiceConnectionPos != -1 && posPlaylistObj!=-1 ) {
				const playlistGuild =  playListArray[posPlaylistObj];
				
				if (playlistGuild.isPlaying) {
					
					
					var urlTemp  = playlistGuild.urlToPlayArray[playlistGuild.positionPlayingNext-1];
					
					
					
					musicList.likeMusic(message.author,urlTemp,-1);
				}
				else{
					botSendMessage("I am not playing music.",message.channel);
				}
			}
			else{
				botSendMessage("I am not playing music.",message.channel);
			}
			
			
		   
			//botSendMessage("\'\"une commande pour les gouverner tous\" ! \' \n - *Oxymore 13.01.2017 à 00h20*",message.channel);
			//TODO modifier
		},
		commandPrefix+"unlike", "note the current video as unlike",truefunc
    ),
	new commandC(
		function(message){
			
			var reg = new RegExp('^'+commandPrefix+'[Dd]is[lL]ike[ ]*$');
			if(notBotFunction(message.author.id)&&reg.test(message.content) ){
				return true
			}
			else{
				return false
			}
		},
		function(message){
			var voiceConnectionPos =getPosOfVoiceConnection(message.guild)
			const posPlaylistObj = findPositionOfThePlaylistObject(message.guild);
			
			if (voiceConnectionPos != -1 && posPlaylistObj!=-1 ) {
				const playlistGuild =  playListArray[posPlaylistObj];
				
				if (playlistGuild.isPlaying) {
					
					
					var urlTemp  = playlistGuild.urlToPlayArray[playlistGuild.positionPlayingNext-1];
					
					
					
					musicList.likeMusic(message.author,urlTemp,-1);
				}
				else{
					botSendMessage("I am not playing music.",message.channel);
				}
			}
			else{
				botSendMessage("I am not playing music.",message.channel);
			}
			
			
		   
			//botSendMessage("\'\"une commande pour les gouverner tous\" ! \' \n - *Oxymore 13.01.2017 à 00h20*",message.channel);
			//TODO modifier
		},
		commandPrefix+"dislike", "same as "+commandPrefix+"unlike",truefunc
    ),
	new commandC(
		function(message){
			
			var reg = new RegExp('^'+commandPrefix+'[Nn]eutral[ ]*$');
			if(notBotFunction(message.author.id)&&reg.test(message.content) ){
				return true
			}
			else{
				return false
			}
		},
		function(message){
			var voiceConnectionPos =getPosOfVoiceConnection(message.guild)
			const posPlaylistObj = findPositionOfThePlaylistObject(message.guild);
			
			if (voiceConnectionPos != -1 && posPlaylistObj!=-1 ) {
				const playlistGuild =  playListArray[posPlaylistObj];
				
				if (playlistGuild.isPlaying) {
					
					
					var urlTemp  = playlistGuild.urlToPlayArray[playlistGuild.positionPlayingNext-1];
					
					
					
					musicList.likeMusic(message.author,urlTemp,0);
				}
				else{
					botSendMessage("I am not playing music.",message.channel);
				}
			}
			else{
				botSendMessage("I am not playing music.",message.channel);
			}
			
			
		   
			//botSendMessage("\'\"une commande pour les gouverner tous\" ! \' \n - *Oxymore 13.01.2017 à 00h20*",message.channel);
			//TODO modifier
		},
		commandPrefix+"eutral", "note the current video as neutral",truefunc
    ),
	
	
]

exports.commandMusic = commandMusic;




exports.isReadyToStop = false;

exports.stop = function(){
	musicList.saveMusic(function(err){
		bot.destroy();
		exports.isReadyToStop = true;
	});
}

