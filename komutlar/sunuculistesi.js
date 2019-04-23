const Discord = require("discord.js");

exports.run = function (client, message) {
    const guildArray = client.guilds.array()
    while (guildArray.length) {
        const embed = new Discord.RichEmbed();
        const guilds = guildArray.splice(0, 25);
        for (const guild of guilds) {
            embed.addField("_______________", ` **Sunucu İsmi :** ${guild.name}\n
      **Kurucu :** @${guild.owner.user.username}#${guild.owner.user.discriminator} (${guild.owner.user.id})\n
      **Kişi Sayısı :** ${guild.memberCount}\n
      **Sunucu ID :** ${guild.id}`);
            embed.setColor("#36393F");
            embed.setTitle('Sunucu Listesi');
            embed.setDescription(`Şu an ${bot.guilds.size} sunucu da bulunuyorum`);
        }
        message.channel.send({ embed: embed });
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['sunucular'],
    permLevel: 0
};

exports.help = {
    name: 'sunucular',
    description: 'sunuculistesi',
    usage: 'sunuculistesi'
}; 