const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
require('./util/eventLoader')(client);
const { GOOGLE_API_KEY } = require('./anahtarlar.json');
const YouTube = require('simple-youtube-api');
const queue = new Map();
const youtube = new YouTube(GOOGLE_API_KEY);
const ytdl = require('ytdl-core');

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.on("guildMemberAdd", async member => {
  let sayac = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
  let otorole = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
  let arole = otorole[member.guild.id].sayi
  let giriscikis = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
  let embed = new Discord.RichEmbed()
    .setTitle('Otorol Sistemi')
    .setDescription(`:loudspeaker: :inbox_tray:  @${member.user.tag}'a Otorol Verildi `)
    .setColor("GREEN")
    .setFooter("Space", client.user.avatarURL);

  if (!giriscikis[member.guild.id].kanal) {
    return;
  }

  try {
    let giriscikiskanalID = giriscikis[member.guild.id].kanal;
    let giriscikiskanali = client.guilds.get(member.guild.id).channels.get(giriscikiskanalID);
    giriscikiskanali.send(`:loudspeaker: :white_check_mark: Hoşgeldin **${member.user.tag}** Rolün Başarıyla Verildi.`);
  } catch (e) { // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
    return console.log(e)
  }

});

client.on("guildMemberAdd", async (member) => {
  let autorole = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
  let role = autorole[member.guild.id].sayi

  member.addRole(role)

});



client.on('message', async msg => {

  if (msg.author.bot) return undefined;
  if (!msg.content.startsWith(prefix)) return undefined;

  const args = msg.content.split(' ');
  const searchString = args.slice(1).join(' ');
  const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
  const serverQueue = queue.get(msg.guild.id);
  let command = msg.content.toLowerCase().split(' ')[0];
  command = command.slice(prefix.length)
  if (command === 'oynat') {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel) return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setColor('RANDOM')
      .setDescription(' <:x:474973245477486612> | İlk Olarak Sesli Bir Kanala Giriş Yapmanız Gerek.'));
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has('CONNECT')) {
      return msg.channel.sendEmbed(new Discord.RichEmbed()
        .setColor('RANDOM')
        .setTitle(' <:x:474973245477486612> | İlk Olarak Sesli Bir Kanala Giriş Yapmanız Gerek.'));
    }
    if (!permissions.has('SPEAK')) {
      return msg.channel.sendEmbed(new Discord.RichEmbed()
        .setColor('RANDOM')
        .setTitle(' <:x:474973245477486612> | Şarkı başlatılamıyor. Lütfen Mikrofonumu Açınız.'));
    }

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
        await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
      }
      return msg.channel.sendEmbed(new Discord.RichEmbed)
        .setTitle(`**✅ | Oynatma Listesi: **${playlist.title}** Kuyruğa Eklendi!**`)
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
        try {
          var videos = await youtube.searchVideos(searchString, 10);
          let index = 0;

          msg.channel.sendEmbed(new Discord.RichEmbed()
            .setTitle('| Şarkı Seçimi')
            .setDescription(`${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}`)
            .setFooter('Lütfen 1-10 arasında bir rakam seçiniz 10 saniye içinde liste iptal edilecektir.')
            .setColor('0x36393E'));
          msg.delete(5000)
          try {
            var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
              maxMatches: 1,
              time: 10000,
              errors: ['time']
            });
          } catch (err) {
            console.error(err);
            return msg.channel.sendEmbed(new Discord.RichEmbed()
              .setColor('0x36393E')
              .setDescription('<:x:474973245477486612> | **Şarkı Değeri Belirtmediğiniz İçin Seçim İptal Edilmiştir**.'));
          }
          const videoIndex = parseInt(response.first().content);
          var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
        } catch (err) {
          console.error(err);
          return msg.channel.sendEmbed(new Discord.RichEmbed()
            .setColor('0x36393E')
            .setDescription('<:x:474973245477486612> | **Aradaım Fakat Hiç Bir Sonuç Çıkmadı**'));
        }
      }
      return handleVideo(video, msg, voiceChannel);

    }
  } else if (command === 'geç') {
    if (!msg.member.voiceChannel) if (!msg.member.voiceChannel) return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setColor('RANDOM')
      .setDescription(' <:x:474973245477486612> | **Lütfen Öncelikle Sesli Bir Kanala Katılınız**.'));
    if (!serverQueue) return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setColor('RANDOM')
      .setTitle('<:x:474973245477486612> | **Hiç Bir Müzik Çalmamakta**'));
    serverQueue.connection.dispatcher.end('**Müziği Geçtim!**');
    return undefined;
  } else if (command === 'durdur') {
    if (!msg.member.voiceChannel) if (!msg.member.voiceChannel) return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setColor('RANDOM')
      .setDescription('**<:x:474973245477486612> | Lütfen Öncelikle Sesli Bir Kanala Katılınız.**'));
    if (!serverQueue) return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setColor('RANDOM')
      .setTitle('<:x:474973245477486612> **| Hiç Bir Müzik Çalmamakta**'));
    msg.channel.send(`:stop_button: **${serverQueue.songs[0].title}** Adlı Müzik Durduruldu`);
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end('**Müzik Bitti**');
    return undefined;
  } else if (command === 'ses') {
    if (!msg.member.voiceChannel) if (!msg.member.voiceChannel) return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setColor('RANDOM')
      .setDescription('<:x:474973245477486612> **| Lütfen Öncelikle Sesli Bir Kanala Katılınız.**'));
    if (!serverQueue) return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setColor('RANDOM')
      .setTitle('<:x:474973245477486612> | **Hiç Bir Müzik Çalmamakta**'));
    if (!args[1]) return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setTitle(`:loud_sound: Şuanki Ses Seviyesi: **${serverQueue.volume}**`)
      .setColor('RANDOM'))
    serverQueue.volume = args[1];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setTitle(`:loud_sound: Ses Seviyesi **${args[1]}** Olarak Ayarlandı.`)
      .setColor('RANDOM'));
  } else if (command === 'çalan') {
    if (!serverQueue) return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setTitle("<:x:474973245477486612> | **Çalan Müzik Bulunmamakta**")
      .setColor('RANDOM'));
    return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setColor('RANDOM')
      .setTitle("Kaizen BOT | Çalan")
      .addField('Başlık', `[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`, true)
      .addField("Süre", `${serverQueue.songs[0].durationm}:${serverQueue.songs[0].durations}`, true))
  } else if (command === 'sıra') {
    let index = 0;
    if (!serverQueue) return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setTitle("<:x:474973245477486612> | **Sırada Müzik Bulunmamakta**")
      .setColor('RANDOM'));
    return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setColor('RANDOM')
      .setTitle('Space | Şarkı Kuyruğu')
      .setDescription(`${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}`))
      .addField('Şu anda çalınan: ' + `${serverQueue.songs[0].title}`);
  } else if (command === 'duraklat') {
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      return msg.channel.sendEmbed(new Discord.RichEmbed()
        .setTitle("**:pause_button: Müzik Senin İçin Durduruldu!**")
        .setColor('RANDOM'));
    }
    return msg.channel.send('<:x:474973245477486612> | **Çalan Müzik Bulunmamakta**');
  } else if (command === 'devam') {
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      return msg.channel.sendEmbed(new Discord.RichEmbed()
        .setTitle("**:arrow_forward: Müzik Senin İçin Devam Etmekte!**")
        .setColor('RANDOM'));
    }
    return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setTitle("**<:x:474973245477486612> | Çalan Müzik Bulunmamakta.**")
      .setColor('RANDOM'));
  }


  return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
  const serverQueue = queue.get(msg.guild.id);
  console.log(video);
  const song = {
    id: video.id,
    title: video.title,
    url: `https://www.youtube.com/watch?v=${video.id}`,
    durationh: video.duration.hours,
    durationm: video.duration.minutes,
    durations: video.duration.seconds,
    views: video.views,
  };
  if (!serverQueue) {
    const queueConstruct = {
      textChannel: msg.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };
    queue.set(msg.guild.id, queueConstruct);

    queueConstruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      play(msg.guild, queueConstruct.songs[0]);
    } catch (error) {
      console.error(`<:x:474973245477486612> **Şarkı Sisteminde Problem Var Hata Nedeni: ${error}**`);
      queue.delete(msg.guild.id);
      return msg.channel.sendEmbed(new Discord.RichEmbed()
        .setTitle(`<:x:474973245477486612> **Şarkı Sisteminde Problem Var Hata Nedeni: ${error}**`)
        .setColor('RANDOM'))
    }
  } else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    if (playlist) return undefined;
    return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setTitle(`<:white_check_mark:474982945304608769> **${song.title}** Adlı Müzik Kuyruğa Eklendi!`)
      .setColor('RANDOM'))
  }
  return undefined;
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  console.log(serverQueue.songs);

  const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
    .on('end', reason => {
      if (reason === '<:x:474973245477486612> | **Yayın Akış Hızı Yeterli Değil.**') console.log('Müzik Bitti.');
      else console.log(reason);
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on('error', error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  serverQueue.textChannel.sendEmbed(new Discord.RichEmbed()
    .setTitle("**Space | 🎙 Müzik Başladı**", `https://cdn.discordapp.com/avatars/473974675194511361/6bb90de9efe9fb80081b185266bb94a6.png?size=2048`)
    .setThumbnail(`https://i.ytimg.com/vi/${song.id}/default.jpg?width=80&height=60`)
    .addField('\nBaşlık', `[${song.title}](${song.url})`, true)
    .addField("\nSes Seviyesi", `${serverQueue.volume}%`, true)
    .addField("Süre", `${song.durationm}:${song.durations}`, true)
    .setColor('RANDOM'));
}


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'sa') {
    if (!msg.guild.member(msg.author).hasPermission("BAN_MEMBERS")) {
      msg.author.sendMessage('Aleyküm selam,  hoş geldin ^^');
    } else {
      msg.reply('Aleyküm selam, hoş geldin ^^');
    }
  }
});

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(process.env.BOT_TOKEN);
