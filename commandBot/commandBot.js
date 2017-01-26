

"use strict";

var DiscordClient = require('discord.js'); // API discord
var path = require("path");
var userList =  require(path.join(__dirname, '/../','data/user.js'));
var serverUtils =  require(path.join(__dirname, '/../','data/servers.js'));
var roleUtils =  require(path.join(__dirname, '/../','data/role.js'));
//var commandUtils =  require(path.join(__dirname, '/../','data/command.js'));



var allBotArrayModules;

var musicBot;

var bot = new DiscordClient.Client();

var userListFaction = []; // lioste des utilisateurs


var asylambaServer;

var developBuild = true

exports.bot = bot; // set by ref ? 

//var email = ""; // email of bot 
//var password = ""; // pass of the bot

 /*********************************************/
 
 
function success(token){
    
    console.log("login sucessful ");
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
    
    musicBot = allBotArrayModules[2];
    
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
			
			var promise = message.react("👌🏽");
			promise.then(function(){}).catch((m) => {console.log(m);});
			
			command[i].func(message); // exécute la commande si la condition correcte est verifiée
			//logDebug("message","command " + message);
		}
    }
    
    
});
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

exports.botSendMessage = botSendMessage;


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



var command = [
    new commandC(
	function(message){
		if(testMessageIfFollowedByMentionToBotOrAllone(message.content,commandPrefix+"ping")){
		    return true;
		}
		else{
		    return false;
		}
	},
	function(message){
		botSendMessage("pong : :ping_pong:  my ping is `"+bot.ping+" ms`",message.channel);
	},
	commandPrefix+"ping", "affiche pong",truefunc
    ),
    new commandC(
	function(message){
	    if(testMessageIfFollowedByMentionToBotOrAllone(message.content,commandPrefix+"help")){
			return true
	    }
	    else{
			return false
	    }
	},
	function(message){
	    var messageTemp = "Liste des commandes\n`";
	    for (var i in command){
			
			if (command[i].showHelp(message)) {
				messageTemp +=  "`"+command[i].inputDescription + "` : "+command[i].descr+"\n";
			}
	    }
	    
	    for (var i in musicBot.commandMusic){
			if (musicBot.commandMusic[i].showHelp(message)) {
				messageTemp +=  "`"+musicBot.commandMusic[i].inputDescription + "` : "+musicBot.commandMusic[i].descr+"\n";
			}
	    }
	    messageTemp += "\nPour plus d'information sur le wiki du bot https://github.com/asylamba/ChickenBot-V2/wiki"
	    
	    if (messageTemp != "") {
			botSendMessage(messageTemp+"",message.channel);
	    }
	    else{
			botSendMessage("no help to show",message.channel);
	    }
	    
	    
	},
	commandPrefix+"help", "affiche la liste des commandes",truefunc
    ),
    new commandC(
	function(message){
	    if(testMessageIfFollowedByMentionToBotOrAllone(message.content,commandPrefix+"exit") && (isAdminFunc(message.author.id) || (message.author.id == "136079026266701824" && developBuild))){
			//																																				Lodis
			// TODO revoir le test pour ajouté des personnes authorisé
			return true
	    }
	    else{
			return false
	    }
	},
	function(message){
	    
	    botSendMessage("stopping",message.channel);
	    setInterval(function(){allBotArrayModules[0].exit();},1000);
	    
	},
	commandPrefix+"exit", "arrête le bot (admin)",function(message){return isAdminFunc(message.author.id);}
    ),
    new commandC(
	function(message){
		if(testMessageIfFollowedByMentionToBotOrAllone(message.content,commandPrefix+"mort")){
		    return true
		}
		else{
		    return false
		}
	},
	function(message){
		
		botSendMessage("A MORT HELIOR",message.channel);
	    
	},
	commandPrefix+"mort", "A MORT HELIOR",truefunc
    ),
    new commandC(
	function(message){
	    if(testMessageIfFollowedByMentionToBotOrAllone(message.content,commandPrefix+"about")){
			return true
	    }
	    else{
			return false
	    }
	},
	function(message){
		
	    botSendMessage("Bonjour, je suis Chicken Bot.\n\n j'ai été créé le 3 janvier 2016 par ChickenStorm pour le serveur Asylamba 2.0 sur Discord.\n\n"+
			   "Mon dépôt git se trouve sous TODO \n\n entrez \"!help\" pour voir la liste de mes commandes",message.channel);
	    //TODO modifier
	},
	commandPrefix+"about", "a propos du bot",truefunc
    ),
    new commandC(
	function(message){
	    if(testMessageIfFollowedByMentionToBotOrAllone(message.content,commandPrefix+"commande")){
			return true
	    }
	    else{
			return false
	    }
	},
	function(message){
		
	    botSendMessage("\'\"une commande pour les gouverner tous\" ! \' \n - *Oxymore 13.01.2017 à 00h20*",message.channel);
	    
	    
	    /*var calback = function(message){
		var reaction = message.reactions.array()[0].emoji;
		
		console.log(reaction);
		
		//botSendMessage(reaction.name+"  :  "+reaction.id +"  :  "+reaction.identifier+"",message.channel)
		message.react(reaction);
	    }
	    
	    setTimeout(function(){calback(message)},10000,message)
	    */
	    //TODO modifier
	},
	commandPrefix+"commande", "",truefunc
    ),
];

exports.command = command;
