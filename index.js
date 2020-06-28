const discord = require('discord.js');
const client = new discord.Client();
const prefix = 'don ';
const token = 'NzI2NTI4NjgxNjM5NjczOTA3.XvkPtw.j42955oiu_cPR-3le4vabA0hUgo';

const ytdl = require("ytdl-core")
const queue = new Map();
const serverID = "687717074440683651";


client.on("ready", () => {
	client.user.setActivity("You", { type: "WATCHING"});
	console.log("Don Joni is online!");
})

client.on('message', async message => {
	if (message.author.bot || !message.content.startsWith(prefix)) return;

	const serverQueue = queue.get(message.guild.id);

	if (message.content.startsWith(`${prefix}salut`)) {
		let nickname = message.author.username;
		message.channel.send(`Salut ${nickname}!`);
		return;
	} 
	else if(message.content.startsWith(`${prefix}kick`)){
		
		if (message.member.roles.cache.some(role => role.name === "The God")) {	
			var	member = message.mentions.members.first();

			if(member === undefined) message.channel.send('You need to tag someone!');
			else {
				member.kick();
				message.channel.send(`${member} was kicked for secret reasons!`)
			}
		}
	}
	else if (message.content === `${prefix}user-info`) {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	}
	else {
		message.channel.send('You need to enter a valid command!');
	}
});

client.login(token);