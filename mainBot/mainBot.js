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

var DiscordClient = require('discord.js'); // API discord

var bot = new DiscordClient.Client(); 
var allBotArrayModules;  // all the bots

exports.bot = bot; // set by ref


function success(token){
	/*
	 * function used by bot.login on success
	 */
	
	console.log("Main login sucessful ");
	bot.user.setGame("en developpement"),
	bot.user.setPresence("dnd")
	
    
}

function err(error){
    /*
     * function used by bot.login on fail
     */
    // handle error
    console.log("Error : " + error +"\n exiting");
    setTimeout(function(){exports.exit()}, 1000); //exit all the bots after a second
    
}


exports.init = function(token,allBotArrayPara){
    /*
     * used to log and init the bot
     * input :
     *   - token : the token of the bot
     *   - allBotArrayPara : the array contening the reference of all the bots
     */
    
    allBotArrayModules = allBotArrayPara;
    bot.login(token).then(success).catch(err);
    
    
}




var botSendMessage = function(message,channel,options){
	/*
	 * send message (you can use .then().catch() )
	 * input :
	 *   - mesage : mesage to send
	 *   - channel : where to send the message
	 *   - options : channel.send the option used by (it is optional)
	 *   
	 */
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


exports.isReadyToStop = false;
exports.stop = function(){
	bot.destroy();
	exports.isReadyToStop = true;
}

exports.exit = function(){
    /*
     * Kill all the bot and close the programe
     */
    
    for (var i in allBotArrayModules) {
		//allBotArrayModules[i].bot.destroy();
		allBotArrayModules[i].stop();
    }
	
	var exitCodeWhenReady= function(){
		var exitBool = true;
		for (var i in allBotArrayModules){
			exitBool = exitBool && allBotArrayModules[i].isReadyToStop;
		}
		if (exitBool) {
			setTimeout(function(){process.exit(0)},1000);
		}
		else{
			setTimeout (exitCodeWhenReady,1000);
		}
	}
	
    setTimeout(exitCodeWhenReady,1000);
}
