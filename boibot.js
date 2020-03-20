const version = `BadBoi`

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

function CM(channel, message){bot.Channels.get(channel).sendMessage(message)} //Short for Channel message. CM(ChannelID,Message)

bot.Dispatcher.on("MESSAGE_CREATE", e =>
{
	var antiecho;
	var guild;
	var msg;
	if (e.message.guild)
	{
		guild = e.message.guild.name
	}
	if (e.message)
	{
		msg = e.message
	}

	//Fleet Legacy Handling
	if (msg.content.split("")[0] == "-")
	{
		console.log("Before Manipulation"+e.message.author.username + " | " + e.message.content + " | " + guild)
		suffix = msg.content.split(" ")
		trigger = suffix[0].replace("-", "")
		suffix = suffix.join(" ")
		suffix = suffix.replace("-"+trigger, "").replace(" ","")
		console.log("Suffix: "+suffix)
		execute = Commands.filter(e => e.name == trigger.toLowerCase())
		if (execute.length < 1)
		{
			CommandsWithAliases = Commands.filter(e => e.aliases) //Ignore commands without aliases
			execute = CommandsWithAliases.filter(e => e.aliases.includes(trigger.toLowerCase()))
		}
		if (execute.length > 1) {CM(logchannel,"Duplicate commands found:\n"+msg.content)}
		if (execute.length > 0)
		{
			if (execute[0].permFlag)
			{flags = hasPerm(msg.guild.id, msg.author.id)
				if(flags[0]) {}
			 	else if(flags[execute[0].permFlag])
				{}else {return msg.reply("Necesary Flag not present, Flag needed: " +execute[0].permFlag+ "\nFor reference of Flag ids use _hasPerms")}
			}
			if (execute[0].noDM && !msg.guild)
			{
				return msg.reply("This Command can not be executed in DMs")
			}
			if (execute[0].level == "master" && msg.author.id != botowner)
			{
				return
			}
			//console.log(suffix)
			try
			{
				execute[0].fn(msg, suffix, bot, client)
			}
			catch (err)
			{
				CM(logchannel, err)
			}
			antiecho = 1;
		}
	}
	
});

function relaymedaddy(message)
{
	var me = "201983882625548299";
	bot.Users.get(me).openDM()
		.then(function(x)
		{
			x.sendMessage(message)
			return x.close()
		})
}
function protoDM(ID, MESSAGE, bot)
{
	bot.Users.get(ID).openDM() //opens the dm
		.then(function(x)
		{ //passes the info of the opened DM into x
			x.sendMessage(MESSAGE) //sends a message to x
			x.close() //closes the DM
		})
		.catch(function(error)
		{
			// handle error
			protoDM('201983882625548299', error)
		})
}

Commands.push(
{
	name: 'info',
	help: "I'll print some information about me.",
	timeout: 10,
	level: 0,
	fn: function(msg, suffix, bot)
	{
		var owner = bot.Users.get(botowner).username
		var field = [
		{
			name: 'Servers Connected',
			value: '```\n' + bot.Guilds.length + '```',
			inline: true
		},
		{
			name: 'Users Known',
			value: '```\n' + bot.Users.length + '```',
			inline: true
		},
		{
			name: 'Channels Connected',
			value: '```\n' + bot.Channels.length + '```',
			inline: true
		},
		{
			name: 'Private Channels',
			value: '```\n' + bot.DirectMessageChannels.length + '```',
			inline: true
		},
		{
			name: 'Messages Received',
			value: '```\n' + bot.Messages.length + '```',
			inline: true
		},
		{
			name: 'Version',
			value: '```\n' + version + '```',
			inline: true
		},
		{
			name: 'Owner',
			value: '```\n' + owner + '```',
			inline: true
		}]
		
		msg.channel.sendMessage('', false,
		{
			color: 0x3498db,
			author:
			{
				icon_url: bot.User.avatarURL,
				name: `${bot.User.username}#${bot.User.discriminator} (${bot.User.id})`
			},
			title: ``,
			timestamp: new Date(),
			fields: field,
			description: '',
			footer:
			{
				//text: `Online for ${getUptime()}`
			}
		})
	}
})
Commands.push(
{
	name: 'dm',
	help: "Direct Message handler",
	hidden: true,
	level: 'master',
	fn: function(msg, suffix, bot)
	{
		suffix = suffix.split("|")
		protoDM(suffix[0], suffix[1], bot)
	}
})

Commands.push(
{
	name: 'tag',
	aliases: ["t"],
	help: 'Tagging system',
	usage: '-t tagname; -t create tagname',
	noDM: true,
	hidden: false,
	level: 0,
	fn: function(msg, suffix, bot)
	{
		tagdir = drive+':/resources/boitags.json'
		mode = suffix.split(" ")[0]
		//tags = require(tagdir)
		var tags = JSON.parse(fs.readFileSync(tagdir,"utf8"))
		
		
		if (!suffix)
		{var rand = tags[Math.floor(Math.random() * tags.length)];
			return msg.channel.sendMessage("\`"+ rand.name +"\` "+rand.value)
		}
		suffix = suffix.replace(suffix.split(" ")[0] + " ", "")
		name = suffix.split(" ")[0]
		value = suffix.replace(suffix.split(" ")[0] + " ", "")
		owner = msg.author.id
		console.log(name, value, owner)
		switch (mode)
		{
			case 'create':
				if (tags.filter(e => e.name == name).length > 0)
				{
					if(tags.filter(e => e.name == name)[0].owner == owner)
					{	tag=tags.filter(e => e.name == name)[0]
					 	tags = tags.filter(e => e.name != name)
						console.log(name, value, owner, "Editing")
					 	msg.addReaction('☑')
					 	tags.push({name: name,value: value,owner: owner})
					 	return fs.writeFileSync(tagdir, JSON.stringify(tags))
					}
					return msg.channel.sendMessage("Tag already exists")
				}
				else
				{
					tags.push(
					{
						name: name,
						value: value,
						owner: owner
					})
					console.log(name, value, owner, "Saving")
					msg.addReaction('☑')
					return fs.writeFileSync(tagdir, JSON.stringify(tags))
				}
				break;
			case 'delete':
				if (tags.filter(e => e.name == name).length > 0)
				{	tag=tags.filter(e => e.name == name)[0]
				 	if(tag.owner == owner || owner == botowner)
					{
						tags = tags.filter(e => e.name != name)
						console.log(name, value, owner, "Deleting")
						msg.addReaction('☑')
						return fs.writeFileSync(tagdir, JSON.stringify(tags))
					}
				 	else
					{
						return msg.channel.sendMessage("Tag is not yours to edit.")
					}
					
				}
				else
				{
					return msg.channel.sendMessage("Tag doesnt exist.")
				}
				break;
			case 'owner':
				if (tags.filter(e => e.name == name).length > 0)
				{	
					tag=tags.filter(e => e.name == name)[0]
					var tagowner = client.users.find(e => e.id == tag.owner).tag
				 	return msg.reply("This tag is owned by "+tagowner)
				}				
				else
				{
					return msg.channel.sendMessage("Tag doesnt exist.")
				}
				break;
			default:
				if (tags.filter(e => e.name == name)[0])
				{
					return msg.channel.sendMessage(tags.filter(e => e.name == name)[0].value)
				}
				else
				{
					return msg.channel.sendMessage("Tag does not exist")
				}
				break;
		}
	}
})

Commands.push(
{
	name: 'kill',
	aliases: ["k"],
	help: '',
	usage: '',
	noDM: false,
	hidden: true,
	level: 'master',
	fn: function(msg, suffix, bot, client)
	{
		client.destroy()
		bot.disconnect()
		process.exit()
	}
})

Commands.push({
    name: 'boi',
    help: "bestboi integration",
    hidden: true,
    aliases: ['bestboi'],
    timeout: 3,
    level: 3,
    fn: function(msg, suffix, bot, client)
	{var URL = "https:\\\\api.vrchat.cloud/api/1/worlds/wrld_05be1d4a-72ae-489b-93bd-489d2b78abc5?apiKey=JlE5Jldo5Jibnk5O5hTx6XVqsJu4WJ26";axios.get(URL, { headers: {} })
		.then(response => {console.log(response.data);})
		.catch((error) => {console.log('error 3 ' + error);}); 
	}
})
