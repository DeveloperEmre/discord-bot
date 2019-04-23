const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    let bicon = client.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setDescription("Botun Bilgileri")
    .setColor("#15f153")
    .setThumbnail(bicon)
    .addField("Bot İsmi", client.user.username)
    .addField("Açılış Tarihi", client.user.createdAt);

    message.channel.send(botembed);
}


exports.conf = {
  enabled: true, //komutut açtık
  guildOnly: false, //sadece servere özel yapmadık
  aliases: ['botbilgi'], //farklı çağrılar ekledik
  permLevel: 0 //kimlerin kullanabileceğini yazdık (bot.js dosyasında perm leveller yazıyor)
};

exports.help = {
  name: 'botbilgi', //adını belirledik (kullanmak için gereken komut)
  description: 'Botun bilgisini gösterir', //açıklaması
  usage: 'botbilgi' //komutun kullanım şekli (mesela hava <bölge>)
};

//komut taslağımız basit anlatımını zaten dosyalarda bulursunuz
//bu ise bizim komut taslağımız
//bunun üzerinden gideceğiz
