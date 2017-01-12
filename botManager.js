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

var mainBot =  require('./mainBot/mainBot.js');
var commandBot =  require('./commandBot/commandBot.js'); 

var fs = require("fs"); // file système pour lire / écire dans des fichier


var emailBot = ""; // email du bot
var passwordBot = ""; // pass du bot
var botToken="";
var loginServ; // [user,pass] for the server connection
//var loginServ; //[user,pass] du bot


var allBotArrayModules = [mainBot,commandBot] // all the bot
// pas de pointeurs ;(



fs.readFile('loginServeur.txt','ascii', function (err, data) { // lit les login pour le serveur
    
    var dataTemp2= data.split(";");
    loginServ = dataTemp2;
    dataTemp2 = "";
    
    fs.readFile('token.txt','ascii', function (err, data) { // lit les login du bot
	var dataTemp= data.split(";");
	var token = dataTemp[0];
	var token2 = dataTemp[1];
	//passwordBot = dataTemp[1];
	data = "";
	dataTemp = [];
	
	mainBot.init(token,allBotArrayModules); 
	commandBot.init(token2,allBotArrayModules);
    });
    
});



