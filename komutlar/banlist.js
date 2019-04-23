const Discord = require('discord.js')

exports.run = (client, message, args) => {
    let Discord = require('discord.js');
    var userlist = message.guild.fetchBans();
    userlist.then(collection => {
        if (collection.first() == null) {
            const embed = new Discord.RichEmbed()
                .setTitle(`:no_entry_sign: Banlanan Kullanıcı bulunamadı :no_entry_sign:`)
                .setColor("RED");
            message.channel.send({ embed });
        }
        else {
            const embed = new Discord.RichEmbed()
                .setTitle(":no_entry_sign: Banlistesi | Sunucudan Banlananlar")
                .setColor("RED");
            for (userlist of collection) {
                var user = userlist[1];
                embed.addField(` **${user.tag}**`, `_________ _____________`);
            }
            message.channel.send({ embed });
        }
    });
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["banlist"],
    permLevel: 0
};
exports.help = {
    name: 'banlananlar',
    description: 'Sunucundan Banlanan üyeleri gösterir.',
    usage: 'banlananlar'
};