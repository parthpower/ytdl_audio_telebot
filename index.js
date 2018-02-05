const TeleBot = require('telebot');
const fs = require('fs');
const ytdl = require('ytdl-core');

const bot = new TeleBot(process.env.TELEGRAM_BOT_KEY);

bot.on('text',(msg)=>{
	let id = msg.from.id;
	let url = msg.text;
	if(ytdl.validateURL(url)){
		let aac_file = ytdl.getURLVideoID(url) + ".aac";
		msg.reply.text("Downloading file to our server...");
		ytdl(url, {quality: "highestaudio", filter: "audioonly"})
			.pipe(fs.createWriteStream(aac_file).on('finish',()=>{
				msg.reply.text("Uploading File...");
				msg.reply.file(aac_file).then(()=>{
					fs.unlink(aac_file);
				});
			}));
	}else{
		msg.reply.text("No Video Found");
	}
});
bot.start();
