const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

exports.run = (client, message, params, args) => {
    const user = message.mentions.members.first() || message.author.tag;
    if (!message.guild) {
        const mesajsilindi = new Discord.RichEmbed()
        const ozelmesajuyari = new Discord.RichEmbed()
            .setColor(0xD97634)
            .setTimestamp()
            .setAuthor(user.username, user.avatarURL)
            .setDescription(':fire: Üzgünüm, bunu yapamazsınız!')
        return message.author.sendEmbed(ozelmesajuyari);
    }
    if (message.channel.type !== "group") {
        const kullanicibilgimk = new Discord.RichEmbed()
        const mesajsilindi = new Discord.RichEmbed()
            .setThumbnail(user.avatarURL)
            .setColor(0x808080)
            .setTimestamp()
            .addField('Kullanıcı adı;', user.username + '#' + user.discriminator)
            .addField('ID;', user.id)
            .addField('Kayıt tarihi;', user.createdAt)
            .addField('Şu an oynadığı oyun;', message.author.presence.game ? message.author.presence.game.name : 'Şu an oyun oynamamakta!')
            .setFooter('Yıkık, iyi eğlenceler diler!', client.user.avatarURL)
        console.log("Y!kullanıcı-bilgi komutu " + user.username + " tarafından kullanıldı.")
        return message.channel.sendEmbed(mesajsilindi)
        return message.channel.sendEmbed(kullanicibilgimk)
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['kullanıcı', 'kullanıcı bilgim', 'kbilgim'],
    permLevel: 0
};

exports.help = {
    name: 'kullanıcı-bilgi',
    description: 'Komutu kullanan kişi hakkında bilgi verir!',
    usage: 'kullanıcı-bilgi'
};