const Discord = require("discord.js");

exports.run = async (bot, message, args) => {

  if (!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
  if (!args[0]) return message.channel.send(":x: Dostum bir sayı belirtmelisin.");
  message.channel.bulkDelete(args[0]).then(() => {
    message.channel.send(`Başarı ile ${args[0]} adet mesaj silindi. :white_check_mark:`).then(msg => msg.delete(5000));
  });
}

exports.conf = {
  enabled: true, //komutut açtık
  guildOnly: false, //sadece servere özel yapmadık
  aliases: ['temizle'], //farklı çağrılar ekledik
  permLevel: 0 //kimlerin kullanabileceğini yazdık (bot.js dosyasında perm leveller yazıyor)
};

exports.help = {
  name: 'ping', //adını belirledik (kullanmak için gereken komut)
  description: 'Botun pingini gösterir', //açıklaması
  usage: 'ping' //komutun kullanım şekli (mesela hava <bölge>)
};