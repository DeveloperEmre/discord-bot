const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
const fs = require("fs");

exports.run = (client, message, params) => {
    var Random = [
        '**Acele ile menzil alınmaz.**',
        '**Acı söz insanı dininden çıkarır, tatlı söz yılanı deliğinden çıkarır.**',
        '**Akıllı sır saklar; aptal sır verir.**', '**Baba oğluna bir bağ bağışlamış, oğul babaya bir salkım üzüm vermemiş.**',
        '**Bağ dua değil, çapa dua ister.**',
        '**Leyleği kuştan mı sayarsın, yazın gelir, kışın gider.**',
    ];
    var atasozuver = Math.floor(Math.random() * Random.length);
    const atasozu = new Discord.RichEmbed()
        .setDescription(`${Random[atasozuver]}`)
        .setColor(0xe2ff00)
        .setTimestamp()
    message.channel.send(atasozu)
};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['atasözü'],
    permLevel: 0
};

exports.help = {
    name: 'atasozu',
    description: 'Bot Tarafından Rasgele Atasözleri Gönderilir',
    usage: 'atasozu'
};