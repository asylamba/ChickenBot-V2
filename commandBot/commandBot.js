

"use strict";

var DiscordClient = require('discord.js'); // API discord
var path = require("path");
var userList =  require(path.join(__dirname, '/../','data/user.js'));
var serverUtils =  require(path.join(__dirname, '/../','data/servers.js'));
var roleUtils =  require(path.join(__dirname, '/../','data/role.js'));
//var commandUtils =  require(path.join(__dirname, '/../','data/command.js'));



var allBotArrayModules;

var bot = new DiscordClient.Client();

var userListFaction = []; // lioste des utilisateurs


var asylambaServer;

exports.bot = bot; // set by ref ? 

//var email = ""; // email of bot 
//var password = ""; // pass of the bot

 /*********************************************/
 
 
function success(token){
    
    console.log("login sucesseful " +"\n exiting");
    bot.user.setGame("en developpement"),
    bot.user.setPresence("dnd")
    
    //setTimeout(function(){process.exit(0)}, 100000);
}

function err(error){
    // handle error
    console.log("Error : " + error +"\n exiting");
    setTimeout(function(){process.exit(0)}, 1000);
    
}


exports.init = function(token,allBotArrayPara){
    allBotArrayModules = allBotArrayPara;
    bot.login(token).then(success).catch(err);
    
    
}

/**********************************************/

bot.on('ready', function() { // quand le bot est pret
    
    var serverList = bot.guilds.array();//
    
    for (var i in serverList){
	if (serverList[i].id ==serverUtils.rootServerId ) {
	    asylambaServer = serverList[i];
	}
    }
    
    
    
});


bot.on('message', function(message) { // quand le bot est pret
    
    //console.log(message.content)
    
    //todo les disable enable ect
    
    for(var i in command){
	if (command[i].testInput(message)) {
	    command[i].func(message); // exécute la commande si la condition correcte est verifiée
	    //logDebug("message","command " + message);
	}
    }
    
    
});
/******************************************/
// user and role test


var isUserOfRole = function(userId,roleID,serverobj){
    // this is kind of slow but i am not stick with the user list => may write function more rapid
    /**
     * fiunction given a user id and a roleid says if the user has the role on the server
     *
     *
     */
    var userListFactionTemp = serverObj.members.array()
    if (userListFactionTemp != undefined) {
	for(var i in userListFactionTemp){
	    if (userID ==userListFactionTemp[i].userID ) {
		var rolesOfUser = userListFactionTemp[i].roles.array();
		
		for (var i in rolesOfUser){
		    if (rolesOfUser[i].id == roleID) {
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
    return isUserOfRole(userID,roleUtils.adminRoleId,asylambaServer);
}
var isModoFunc = function(userID){
    /**
     * return true if the user is an modo or above
     */
     return isUserOfRole(userID,roleUtils.modoRoleId,asylambaServer) || isUserOfRole(userID,roleUtils.adminRoleId,asylambaServer);
}

var isBanFunc = function(userID){
	retrunval = false;
	
	/*for(var i in userList.users){
		if (userID ==userList.users[i].userID ) {
			return userList.users[i].isBan;
		}
	}*/
	if (userListFaction != undefined) {
		for(var i in userListFaction){
			if (userID ==userListFaction[i].userID ) {
				return userListFaction[i].isBan;
			}
		}
	}
	
	return retrunval;
}
/**********************************************************************************/
// bot related function

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


var command = [
    new commandC(
	function(message){
		if(message.content=="!ping"){
		    return true
		}
		else{
		    return false
		}
	},
	function(message){
		botSendMessage("pong",message.channel);
	},
	"!ping", "affiche pong",truefunc
    ),
    new commandC(
	function(message){
		if(message.content=="!help"){
		    return true
		}
		else{
		    return false
		}
	},
	function(message){
		var messageTemp = "";
		for (var i in command){
		    if (command[i].showHelp(message)) {
			messageTemp += command[i].inputDescription + " : "+command[i].descr+"\n"
			
			
		    }
		}
		botSendMessage(messageTemp,message.channel);
		//bot.sendMessage({
		//	to: channelID,
		//	message: messageTemp
		//});
	    
	},
	"!help", "affiche la liste des commandes",truefunc
    ),
];

exports.command = command;
