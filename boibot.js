const version = `Hello World`

try
{
	Config = require('./config.json')
}
catch (e)
{
	console.log('Boi.js encountered an error while trying to load the config file, please resolve this issue and restart Fleet\n\n' + e.message)
	process.exit()
}
var drive = "C"
if(Config.bot.dir)
{
	drive = Config.bot.dir
}

const botmain = require("discordie"),
	logchannel = "300131285634908163",
	botowner = "201983882625548299",
	axios = require('axios'); //better HTML request.
//const sharp = require('sharp'); //Image processing.
const Path = require('path');
const isUp = require('is-up');
var fs = require("fs"),
	servers = [],
	started = Date.now(),
	XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
	Http = new XMLHttpRequest,
	Commands = [],
	Event = botmain.Events,
	unirest = require("unirest"),
	game = {
		type: 1,
		name: "with the bois.",
		url: "https://vrchat.com/home/world/wrld_05be1d4a-72ae-489b-93bd-489d2b78abc5"
	};

const protocord = require('discord.js');
const client = new protocord.Client();

console.log(started)
bot = new botmain(
{
	messageCacheLimit: 9999,
	autoReconnect: true,
});
client.login(Config.bot.token)
bot.connect(
{
	token: Config.bot.token
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
/*
client.on('channelUpdate', e =>{ if(e.guild.id == '180538463655821312') {CM('323951163752054785',"A Channel was moved:\nChannel "+e.name+"\n Moved to "+e.position)
									//console.log(e)
									}
			       })*/
bot.isFirstConnect = 1
bot.Dispatcher.on("GATEWAY_READY", e =>
{
	
	
	console.log("Connected as: " + bot.User.username);
	bot.User.setStatus("online", game)
	console.log(bot.User)
	bot.Channels.get(logchannel).sendMessage("Systems online. Version: " + version+"\nBoot Code: "+bot.isFirstConnect+"\n"+"Connected to: "+ servers + " Servers")
	var namedservers=[];
	for (i = 0; i < bot.Guilds.toArray().length; i++)
	{
		if(!servers.includes(bot.Guilds.toArray()[i].id)) {servers.push(bot.Guilds.toArray()[i].id);namedservers.push(bot.Guilds.toArray()[i].name)}
	}
	bot.Channels.get(logchannel).sendMessage(namedservers.join(" | "))
	console.log("Connected to:", servers)
	bot.isFirstConnect = 0
});
bot.Dispatcher.on("DISCONNECTED", e =>
{
	return console.log("Connection lost", console.log(servers))
});
