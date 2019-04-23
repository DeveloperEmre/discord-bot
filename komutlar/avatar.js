const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    const user = message.mentions.users.first();
    message.channel.send(user.avatarURL)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: 'avatar',
    description: 'avatar komutu işte .d',
    usage: 'avatar'
};