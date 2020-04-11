const version = `BadBoi V2.2666`

try {
    Config = require('./config.json')
} catch (e) {
    console.log('Boi.js encountered an error while trying to load the config file, please resolve this issue and restart Badboi\n\n' + e.message)
    process.exit()
}
var drive = "C"
if (Config.bot.dir) {
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
bot = new botmain({
    messageCacheLimit: 9999,
    autoReconnect: true,
});
client.login(Config.bot.token)
bot.connect({
    token: Config.bot.token
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    statusliveupdate(120)

});

bot.isFirstConnect = 1
bot.Dispatcher.on("GATEWAY_READY", e => {


    console.log("Connected as: " + bot.User.username);
    //bot.User.setStatus("online", game)
    console.log(bot.User)
    bot.Channels.get(logchannel).sendMessage("Systems online. Version: " + version + "\nBoot Code: " + bot.isFirstConnect + "\n" + "Connected to: " + servers + " Servers")
    var namedservers = [];
    for (i = 0; i < bot.Guilds.toArray().length; i++) {
        if (!servers.includes(bot.Guilds.toArray()[i].id)) {
            servers.push(bot.Guilds.toArray()[i].id);
            namedservers.push(bot.Guilds.toArray()[i].name)
        }
    }
    bot.Channels.get(logchannel).sendMessage(namedservers.join(" | "))
    console.log("Connected to:", servers)
	if(bot.isFirstConnect)
	{startscrapers()}
    bot.isFirstConnect = 0

});

bot.Dispatcher.on("DISCONNECTED", e => {
    return console.log("Connection lost", console.log(servers))
});

function CM(channel, message) {
    bot.Channels.get(channel).sendMessage(message)
} //Short for Channel message. CM(ChannelID,Message)

bot.Dispatcher.on("MESSAGE_CREATE", e => {
    var antiecho;
    var guild;
    var msg;
    if (e.message.guild) {
        guild = e.message.guild.name
    }
    if (e.message) {
        msg = e.message
    }

    //Fleet Legacy Handling
    if (msg.content.split("")[0] == "-") {
        console.log("Before Manipulation" + e.message.author.username + " | " + e.message.content + " | " + guild)
        suffix = msg.content.split(" ")
        trigger = suffix[0].replace("-", "")
        suffix = suffix.join(" ")
        suffix = suffix.replace("-" + trigger, "").replace(" ", "")
        console.log("Suffix: " + suffix)
        execute = Commands.filter(e => e.name == trigger.toLowerCase())
        if (execute.length < 1) {
            CommandsWithAliases = Commands.filter(e => e.aliases) //Ignore commands without aliases
            execute = CommandsWithAliases.filter(e => e.aliases.includes(trigger.toLowerCase()))
        }
        if (execute.length > 1) {
            CM(logchannel, "Duplicate commands found:\n" + msg.content)
        }
        if (execute.length > 0) {
            if (execute[0].permFlag) {
                flags = hasPerm(msg.guild.id, msg.author.id)
                if (flags[0]) {} else if (flags[execute[0].permFlag]) {} else {
                    return msg.reply("Necesary Flag not present, Flag needed: " + execute[0].permFlag + "\nFor reference of Flag ids use _hasPerms")
                }
            }
            if (execute[0].noDM && !msg.guild) {
                return msg.reply("This Command can not be executed in DMs")
            }
            if (execute[0].level == "master" && msg.author.id != botowner) {
                return
            }
            //console.log(suffix)
            try {
                execute[0].fn(msg, suffix, bot, client)
            } catch (err) {
                CM(logchannel, err)
            }
            antiecho = 1;
        }
    }

});

function relaymedaddy(message) {
    var me = "201983882625548299";
    bot.Users.get(me).openDM()
        .then(function(x) {
            x.sendMessage(message)
            return x.close()
        })
}

function protoDM(ID, MESSAGE, bot) {
    bot.Users.get(ID).openDM() //opens the dm
        .then(function(x) { //passes the info of the opened DM into x
            x.sendMessage(MESSAGE) //sends a message to x
            x.close() //closes the DM
        })
        .catch(function(error) {
            // handle error
            protoDM('201983882625548299', error)
        })
}

Commands.push({
    name: 'info',
    help: "I'll print some information about me.",
    timeout: 10,
    level: 0,
    fn: function(msg, suffix, bot) {
        var owner = bot.Users.get(botowner).username
        var field = [{
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
            }
        ]

        msg.channel.sendMessage('', false, {
            color: 0x3498db,
            author: {
                icon_url: bot.User.avatarURL,
                name: `${bot.User.username}#${bot.User.discriminator} (${bot.User.id})`
            },
            title: ``,
            timestamp: new Date(),
            fields: field,
            description: '',
            footer: {
                //text: `Online for ${getUptime()}`
            }
        })
    }
})
Commands.push({
    name: 'dm',
    help: "Direct Message handler",
    hidden: true,
    level: 'master',
    fn: function(msg, suffix, bot) {
        suffix = suffix.split("|")
        protoDM(suffix[0], suffix[1], bot)
    }
})

Commands.push({
    name: 'tag',
    aliases: ["t"],
    help: 'Tagging system',
    usage: '-t tagname; -t create tagname',
    noDM: true,
    hidden: false,
    level: 0,
    permFlag: 3,
    fn: function(msg, suffix, bot) {
        tagdir = drive + ':/resources/boitags.json'
        mode = suffix.split(" ")[0]
        //tags = require(tagdir)
        var tags = JSON.parse(fs.readFileSync(tagdir, "utf8"))


        if (!suffix) {
            var rand = tags[Math.floor(Math.random() * tags.length)];
            return msg.channel.sendMessage("\`" + rand.name + "\` " + rand.value)
        }
        suffix = suffix.replace(suffix.split(" ")[0] + " ", "")
        name = suffix.split(" ")[0]
        value = suffix.replace(suffix.split(" ")[0] + " ", "")
        owner = msg.author.id
        console.log(name, value, owner)
        switch (mode) {
            case 'create':
                if (tags.filter(e => e.name == name).length > 0) {
                    if (tags.filter(e => e.name == name)[0].owner == owner) {
                        tag = tags.filter(e => e.name == name)[0]
                        tags = tags.filter(e => e.name != name)
                        console.log(name, value, owner, "Editing")
                        msg.addReaction('☑')
                        tags.push({
                            name: name,
                            value: value,
                            owner: owner
                        })
                        return fs.writeFileSync(tagdir, JSON.stringify(tags))
                    }
                    return msg.channel.sendMessage("Tag already exists")
                } else {
                    tags.push({
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
                if (tags.filter(e => e.name == name).length > 0) {
                    tag = tags.filter(e => e.name == name)[0]
                    if (tag.owner == owner || owner == botowner) {
                        tags = tags.filter(e => e.name != name)
                        console.log(name, value, owner, "Deleting")
                        msg.addReaction('☑')
                        return fs.writeFileSync(tagdir, JSON.stringify(tags))
                    } else {
                        return msg.channel.sendMessage("Tag is not yours to edit.")
                    }

                } else {
                    return msg.channel.sendMessage("Tag doesnt exist.")
                }
                break;
            case 'owner':
                if (tags.filter(e => e.name == name).length > 0) {
                    tag = tags.filter(e => e.name == name)[0]
                    var tagowner = client.users.find(e => e.id == tag.owner).tag
                    return msg.reply("This tag is owned by " + tagowner)
                } else {
                    return msg.channel.sendMessage("Tag doesnt exist.")
                }
                break;
            default:
                if (tags.filter(e => e.name == name)[0]) {
                    return msg.channel.sendMessage(tags.filter(e => e.name == name)[0].value)
                } else {
                    return msg.channel.sendMessage("Tag does not exist")
                }
                break;
        }
    }
})

Commands.push({
    name: 'kill',
    aliases: ["k"],
    help: '',
    usage: '',
    noDM: false,
    hidden: true,
    level: 'master',
    fn: function(msg, suffix, bot, client) {
        client.destroy()
        bot.disconnect()
        process.exit()
    }
})
/*
Commands.push({
    name: 'boi',
    help: "bestboi integration",
    hidden: true,
    aliases: ['bestboi'],
    timeout: 3,
    level: 3,
    fn: function(msg, suffix, bot, client)
	{var URL = "https:\\\\api.vrchat.cloud/api/1/worlds/wrld_05be1d4a-72ae-489b-93bd-489d2b78abc5?apiKey=JlE5Jldo5Jibnk5O5hTx6XVqsJu4WJ26";axios.get(URL, { headers: {} })
		.then(response => {
		msg.reply(response.data.favorites)
		})
		.catch((error) => {console.log('error 3 ' + error);}); 
	 
	}
})
*/
client.on('message', msg => {
    if (!msg || !msg.guild) {
        return
    }
    if (msg.content == "_hasPerms") {
        var user = msg.author.id;
        var guild = msg.guild.id
        result = hasPerm(guild, user);
        result = permflags[0] + " : " + result[0] + " : ID in array is 0\n" +
            permflags[1] + " : " + result[1] + " : ID in array is 1\n" +
            permflags[2] + " : " + result[2] + " : ID in array is 2\n" +
            permflags[3] + " : " + result[3] + " : ID in array is 3\n" +
            permflags[4] + " : " + result[4] + " : ID in array is 4\n"
        msg.channel.send(result)
    }
});

const permflags = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_MESSAGES", "MANAGE_NICKNAMES"]

function hasPerm(guild, user) {
    var flagstates = []
    for (i = 0; i < permflags.length; i++) {
        let torf = client.guilds.find(e => e.id == guild).member(user).hasPermission(permflags[i])
        let currentflag = permflags[i]
        flagstates.push(torf)
    }
    return flagstates
}

Commands.push({
    name: 'node',
    help: "NO words just death",
    hidden: true,
    aliases: ['njs'],
    timeout: 3,
    level: 'master',
    fn: function(msg, suffix, bot, client) {
        fs.writeFileSync("tempjs.js", suffix)
        var child_process = require('child_process');
        child_process.exec("node tempjs.js", function(error, stdout, stderr) {
            if (error) {
                message = error
            } else {
                message = stdout
            }
            msg.reply("Response:\n" + message);
        });
    }
})

Commands.push({
    name: 'help',
    hidden: false,
    help: 'Sends a help message.',
    usage: '-help or help command',
    noDM: false,
    level: 0,
    fn: function(msg, suffix) {
        console.log(suffix)
        var msgArray = []
        var msgArraytwo = []
        var cmdone = []
        if (!suffix) {
            for (var index in Commands) {
                if (Commands[index].hidden || Commands[index].level === 'master') {
                    continue
                } else {
                    cmdone.push(Commands[index].name + ' = "' + Commands[index].help + '"')
                }
            }
            var cmdtwo = cmdone.splice(0, cmdone.length / 2)
            msgArray.push('**Available Commands:** \n')
            msgArray.push('```ini')
            msgArray.push(cmdone.sort().join('\n') + '\n')
            msgArray.push('```')
            msgArraytwo.push('```ini')
            msgArraytwo.push(cmdtwo.sort().join('\n') + '\n')
            msgArraytwo.push('```')
            msgArraytwo.push('')
            msgArraytwo.push('')
            msgArraytwo.push('')
            msg.author.openDM().then((y) => {
                if (!msg.isPrivate) {
                    msg.channel.sendMessage('Help is underway ' + msg.author.mention + '!')
                }
                y.sendMessage(msgArray.join('\n'))
                y.sendMessage(msgArraytwo.join('\n'))
            }).catch((e) => {
                Logger.error(e)
                msg.channel.sendMessage('Well, this is awkward, something went wrong while trying to PM you. Do you have them enabled on this server?')
            })
        } else if (suffix) {
            command = Commands.filter(e => e.name == suffix)
            if (command.length < 1) {
                CommandsWithAliases = Commands.filter(e => e.aliases) //Ignore commands without aliases
                command = CommandsWithAliases.filter(e => e.aliases.includes(suffix))
            }
            if (command.length > 0) {
                command = command[0]
            } else {
                msg.channel.sendMessage(suffix + " not found.")
            }
            text = `\`Name: ${command.name}\`\n`
            text = text + `\`Description: ${command.help}\`\n`
            text = text + `\`Level: ${command.level}\`\n`
            if (command.usage) {
                text = text + `\`Usage: ${command.usage}\`\n`
            }
            if (typeof command.noDM != 'undefined') {
                text = text + `\`Unusable in DM: ${command.noDM}\`\n`
            }
            if (typeof command.hidden != 'undefined' && command.hidden) {
                text = suffix + " not found."
            }
            msg.channel.sendMessage(text)
        }
    }
})
function snomposter(snomchannels,searchindex,suffix,file,posttxt,delay) {
    setTimeout(function() {
        try{
	    var newestpost  = fs.readFileSync(file,"utf8")
	    }
	catch (e)
		{
			CM(logchannel,"File for "+file+" was not found\n"+e)
		var newestpost  = "none"
		}
        axios.get(suffix).then(function(e) {
                e.data = e.data.split("\"").filter(a => a.includes(searchindex)).filter(b => !b.includes(suffix))
                var antidupe = [];
                var antidupetrue = [];
                for (i = 0; i < e.data.length; i++) {
                    if (antidupetrue.includes(e.data[i])) {
                        continue;
                    }
                    antidupetrue.push(e.data[i])
                    antidupe.push("https://twitter.com" + e.data[i])
                }
                e.data = antidupe
                if (e.data[0] == newestpost) {
                    return snomposter(snomchannels,searchindex,suffix,file,posttxt,delay) 
                } else {
                    for (i = 0; i < snomchannels.length; i++) {CM(snomchannels[i], posttxt+e.data[0])}
			 fs.writeFileSync(file,e.data[0])
                        return snomposter(snomchannels,searchindex,suffix,file,posttxt,delay) 
                }

            })
            .catch(function(error) {
               console.log(error)
            })
    }, delay * 1000);
}
function startscrapers()
{//twitter.com/bestboip
//snomposter(["channel"],"/username/status/", "https://twitter.com/username","postname","Displayed text on post!\n",delay) //delay in seconds
snomposter(["300131285634908163","559624972742688769"],
	   "/BestboiP/status/", "https://twitter.com/BestboiP","bestboiposts","New BestBoi Project tweet!\n",120) //delay in seconds

}
function statusliveupdate(delay) {
    setTimeout(function() {
          var URL = "https://api.vrchat.cloud/api/1/worlds/wrld_05be1d4a-72ae-489b-93bd-489d2b78abc5?apiKey=JlE5Jldo5Jibnk5O5hTx6XVqsJu4WJ26";
    axios.get(URL, {auth:{username: Config.vrchat.user,password: Config.vrchat.password}})
        .then(response => {console.log(response)
	    bot.Channels.get('691022282981900328').update("world favs: "+response.data.favorites)
	    bot.Channels.get('691022699048206386').update("world visits: "+response.data.visits)
            var game = "Public: " + response.data.publicOccupants + "| Visited: " + response.data.privateOccupants
			client.user.setActivity(game, { type: 'WATCHING' })
			statusliveupdate(delay)
			//console.log(game)
        })
        	.catch((error) => {
            console.log('error 3 ' + error)
        })
    }, delay * 1000);
}

