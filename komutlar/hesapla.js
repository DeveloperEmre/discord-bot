const Discord = require('discord.js');
const math = require('math-expression-evaluator')
const stripIndents = require('common-tags').stripIndents



exports.run = function (client, msg, args) {
    var soru = args.join(' ');

    if (!soru) return msg.reply('Bir işlem belirtin. **Doğru Kullanım**: !hesapla <işlem>')
    else {
        let cevap;
        try {
            cevap = math.eval(soru)
        } catch (err) {
            msg.channel.send('Hatalı işlem: **' + err)
        }

        const embed = new Discord.RichEmbed()
            .addField('Soru', soru)
            .addField('Cevap', cevap)

        msg.channel.send(embed)
    }


};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['hesapla'],
    permLevel: 0
};

exports.help = {
    name: 'hesapla',
    description: 'Belirtilen işlemi yapar.',
    usage: 'hesapla <işlem>'
};