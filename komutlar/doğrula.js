const Discord = require('discord.js');
exports.run = async (client, message, args, ops) => {
    message.delete()
    if (!message.member.roles.find("name", "Rol")) {
        return message.channel.send(' **Bu Komutu Kullanmak için** \*`Rol*\` **Rolüne Sahip Olman Lazım** ')
            .then(m => m.delete(5000));
    }
    let toverify = message.guild.member(message.mentions.users.first());
    let verifyrole = message.guild.roles.find(`name`, "Doğrulandı");
    if (!verifyrole) return message.reply("Rol Bulunamadı Lütfen 'Doğrulandı' Adıyla Rol Oluşturunuz.");
    if (!toverify) return message.reply("Bir kullanıcıdan bahsetmelisin.");
    await (toverify.addRole(verifyrole.id));
    let vUser = message.guild.member(message.mentions.users.first());
    let verifembed = new Discord.RichEmbed()
        .setTitle("Doğrulama Kullanıcı- Logları")
        .setColor('#a5f23a')
        .addField("Doğrulayan Kişi", `${message.author.tag}`, true)
        .addField("Kanal", message.channel, true)
        .addField("Doğrulanan Kullanıcı", `${vUser}`, true)
        .setTimestamp();
    let veriflog = message.guild.channels.find(`name`, "logs");
    if (!veriflog) return message.channel.send("Doğrulama Kullanıcı Log Kanalı bulunamadı. Lütfen 'logs' Adlı Kanal Oluşturunuz.`");
    veriflog.send(verifembed);
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['verify', 'Verify', 'Doğrula', 'doğrula'],
};

exports.help = {
    name: 'Kullanıcı-doğrula',
    description: 'Kullanıcı İçin Doğrulandı Rolünü Verir.',
    usage: 'doğrula'
};