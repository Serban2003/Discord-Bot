const discord = require('discord.js');
const client = new discord.Client();
const prefix = 'don';
const token = 'NzI2NTI4NjgxNjM5NjczOTA3.XvemqA.eCMW-Q10Y4Vn8n83UJprNjjJ4hY';

const ytdl = require("ytdl-core")
const queue = new Map();

client.on('ready', () =>{
    console.log('Bot online!');
});

// client.on('message', message =>{
//     if(!message.content.startsWith(prefix) || message.author.bot) return;
    
//     let args = message.content.substring(prefix.length).split(" ");

//     if(args[1] == 'salut'){
//         message.channel.send('Salut!');
//     }
//     else if(args[1] == 'play'){

//         function play(connection, message){
//             var server = servers[message.guild.id];

//             server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));
//             server.queue.shift();
//             server.dispatcher.on("end", function(){
//                 if(server.queue[0]){
//                     play(connection, message);
//                 }else connection.disconnect();
//             });
//         }


//         if(!args[2]){
//             message.channel.send('Hey! You need to provide a link.');
//             return;
//         } 
//         if(!message.member.voice.channel){
//             message.channel.send('You need to be in a voice channel!');
//             return;
//         }

//         if(!servers[message.guild.id]) servers[message.guild.id] = {
//             queue: []
//         }
//         var server = servers[message.guild.id];

//         if(!message.member.voice.connection) message.member.voice.channel.join().then(function(connection){
//             play(connection, message);
//         });
//     }


    
//     else if(message.content.startsWith('don fuck you')){
//         message.channel.send("Fuck you too!");
//     }
//     else if(message.content.startsWith('don fuck me')){
//         message.channel.send("I am waiting in your bed bro!");
//     }
//     else if(message.content.startsWith('don i wanna be good')){
//         message.channel.send("That's not gonna happen");
//     }
// });
client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	const serverQueue = queue.get(message.guild.id);

	if (message.content.startsWith(`${prefix}play`)) {
		execute(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${prefix}skip`)) {
		skip(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${prefix}stop`)) {
		stop(message, serverQueue);
		return;
	} else {
		message.channel.send('You need to enter a valid command!')
	}
});

async function execute(message, serverQueue) {
	const args = message.content.split(" ");

	if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to play music!');
	
	const songInfo =  await ytdl.getInfo(args[1]);
	console.log(songInfo.video_url);
	const song = {
		title: songInfo.title,
		url: songInfo.video_url,
	};

	if (!serverQueue) {
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: message.member.voice.channel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
		};

		queue.set(message.guild.id, queueContruct);

		queueContruct.songs.push(song);

		try {
			var connection = await message.member.voice.channel.join();
			queueContruct.connection = connection;
			play(message.guild, queueContruct.songs[0]);
		} catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		return message.channel.send(`${song.title} has been added to the queue!`);
	}

}

function skip(message, serverQueue) {
	if (!message.member.message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');
	serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
	if (!message.member.message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.message.member.voice.channel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.play(ytdl(song.url, 'audioonly'))
		.on('end', () => {
			console.log('Music ended!');
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

client.login(token);