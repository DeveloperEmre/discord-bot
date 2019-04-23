const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
    .setDescription("Server Information")
    .setColor("#15f153")
    .setThumbnail(sicon)
    .addField("Sunucu İsmi", message.guild.name)
    .addField("Açıldığı Tarih", message.guild.createdAt)
    .addField("Sunucuya katıldığın tarih", message.member.joinedAt)
    .addField("Toplam üyeler", message.guild.memberCount)
    .addField("Roller", message.guild.roles)
    .setThumbnail(message.guild.iconURL)


    message.channel.send(serverembed);
}


exports.conf = {
  enabled: true, //komutut açtık
  guildOnly: false, //sadece servere özel yapmadık
  aliases: ['serverbilgi'], //farklı çağrılar ekledik
  permLevel: 0 //kimlerin kullanabileceğini yazdık (bot.js dosyasında perm leveller yazıyor)
};

exports.help = {
  name: 'serverbilgi', //adını belirledik (kullanmak için gereken komut)
  description: 'Botun pingini gösterir', //açıklaması
  usage: 'serverbilgi' //komutun kullanım şekli (mesela hava <bölge>)
};