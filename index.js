const discord = require("discord.js");
const botConfig = require("./botconfig.json");



const fs = require("fs");

const bot = new discord.Client();





bot.on("ready", async () => {

    console.log(`${bot.user.username} is online!`)

    bot.user.setActivity("Roleplay Reality", { type: "PLAYING" });

});


bot.on("message", async message => {
    // Als de bot het bericht stuurd word er niet op gereageerd
    if (message.author.bot) return;

    if (message.channel.type === "dm") return;

    var prefix = botConfig.prefix;

    var messageArrey = message.content.split(" ");

    var command = messageArrey[0];

    var arguments = messageArrey.slice(1);




    //TICKET SYSTEEM

    if (command === `${prefix}ticket`) {

        const categoryId = "722525772920651777";

        var userName = message.author.username;

        var userDiscriminator = message.author.discriminator;

        var bool = false;

        message.guild.channels.forEach((channel) => {

            if (channel.name == userName.toLowerCase() + "-" + userDiscriminator) {

                message.channel.send("Je hebt al een ticket aangemaakt");

                bool = true;
            }

        });

        if (bool == true) return;

        var embedCreateTicket = new discord.RichEmbed()
            .setTitle("Hoi, " + message.author.username)
            .setFooter("Het ticket kanaal wordt voor je aangemaakt, het Meldkamer Team zal zo snel mogelijk reageren");

        message.channel.send(embedCreateTicket);

        message.guild.createChannel(userName + "-" + userDiscriminator, "text").then((createdChan) => {

            createdChan.setParent(categoryId).then((settedParent) => {

                settedParent.overwritePermissions(message.guild.roles.find('name', "@everyone"), { "READ_MESSAGES": false });
              settedParent.overwritePermissions(message.guild.roles.find('name', "Team Manager"), {

                    "READ_MESSAGES": true, "SEND_MESSAGES": true,
                    "ATTACH_FILES": true, "CONNECT": true,
                    "CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true

                });
                              settedParent.overwritePermissions(message.guild.roles.find('name', "Instructeur"), {

                    "READ_MESSAGES": true, "SEND_MESSAGES": true,
                    "ATTACH_FILES": true, "CONNECT": true,
                    "CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true

                });
                
                settedParent.overwritePermissions(message.author, {

                    "READ_MESSAGES": true, "SEND_MESSAGES": true,
                    "ATTACH_FILES": true, "CONNECT": true,
                    "CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true

                });

                var embedParent = new discord.RichEmbed()
                    .setTitle("Hoi, " + message.author.username.toString())
                    .setDescription("Hier kan je Live je vragen stellen aan het Meldkamer Team");

                settedParent.send(embedParent);


            }).catch(err => {

                message.channel.send("Er vindt een systeemfout plaats, contacteer Arne D.");
            });

        }).catch(err => {

            message.channel.send("Er vindt een systeemfout plaats, contacteer Arne D.");
        });

    }


    //clear command

    if (command === `${prefix}clear`) {

        if (!message.member.hasPermissions("MANAGE_MESSAGES")) return message.reply("Je hebt geen toestemming");

        if (!arguments[0]) return message.channel.send("Geef een aantal op.");

        if (Number.isInteger(parseInt(arguments[0]))) {

            var amount = parseInt(arguments[0]) + 1;

            message.channel.bulkDelete(amount).then(() => {
                if (arguments[0] == 0) {

                    message.channel.send(`Ben je incapabel ofzo? Ik kan geen 0 berichten verwijderen`).then(msg => msg.delete(3000));

                } else if (arguments[0] == 1) {

                    message.channel.send(`Ik heb 1 bericht verwijderd.`).then(msg => msg.delete(3000));

                } else {

                    message.channel.send(`Ik heb ${arguments[0]} berichten verwijderd`).then(msg => msg.delete(3000));
                }


            });

        } else {
            return message.channel.send("Geef een aantal op.");
        }

    }


    //Suggestie command

    if (command === `${prefix}suggestie`) {


        var suggestie = arguments.join(' ');
        if (!suggestie) return message.channel.send("Geen Suggestie gegeven");

        var suggestieEmbed = new discord.RichEmbed()
            .setTitle("Nieuw Idee")
            .setColor("#00FF00")
            .addField("Suggestie", suggestie)
            .addField("Ingezonden door", message.author);

        var suggestieChannel = message.guild.channels.find(x => x.name === "suggesties");
        if (!suggestieChannel) return message.channel.send("Er is een systeemfout! Contacteer Arne D.");

        suggestieChannel.send(suggestieEmbed).then(embedMessage => {
            embedMessage.react('✅');
            embedMessage.react('❌');

        });

    }
    
        if (command === `${prefix}vraag`) {


        var suggestie = arguments.join(' ');
        if (!suggestie) return message.channel.send("Geen vraag gesteld");

        var suggestieEmbed = new discord.RichEmbed()
            .setTitle("Nieuwe vraag")
            .setColor("#00FF00")
            .addField("Vraag", vraag)
            .addField("Ingezonden door", message.author);

        var suggestieChannel = message.guild.channels.find(x => x.name === "suggesties");
        if (!suggestieChannel) return message.channel.send("Er is een systeemfout! Contacteer Arne D.");

        suggestieChannel.send(suggestieEmbed).then(embedMessage => {
            embedMessage.react('✅');
            embedMessage.react('❌');

        });

    }
    
            if (command === `${prefix}klacht`) {


        var suggestie = arguments.join(' ');
        if (!suggestie) return message.channel.send("Geen klacht opgegeven");

        var suggestieEmbed = new discord.RichEmbed()
            .setTitle("Nieuwe klacht")
            .setColor("#00FF00")
            .addField("Klacht", klacht)
            .addField("Ingezonden door", message.author);

        var suggestieChannel = message.guild.channels.find(x => x.name === "klachten");
        if (!suggestieChannel) return message.channel.send("Er is een systeemfout! Contacteer Arne D.");

        suggestieChannel.send(suggestieEmbed).then(embedMessage => {
            embedMessage.react('✅');
            embedMessage.react('❌');

        });

    }
    //RANGALSJEJOINT

    bot.on("guildMemberAdd", member => {
        var role = member.guild.roles.find(x => x.name === "member");

        if (!role) return;

        member.addRole(role);

        const channel = member.guild.channels.find(x => x.name === "❕join-channel");
        if (!channel) return;

        channel.send(`Welkom bij de server!! ${member}`);

    });

    //Muziek bot 















});




bot.login(process.env.token);
