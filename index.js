const discord = require("discord.js");
const botConfig = require("./botconfig.json");


const fs = require("fs");

const bot = new discord.Client();



bot.on("ready", async () => {

    console.log(`${bot.user.username} is online!`)

    bot.user.setActivity("FiveM", { type: "PLAYING" });

});


bot.on("message", async message => {
    // Als de bot het bericht stuurd word er niet op gereageerd
    if (message.author.bot) return;

    if (message.channel.type === "dm") return;

    var prefix = botConfig.prefix;

    var messageArrey = message.content.split(" ");

    var command = messageArrey[0];

    var arguments = messageArrey.slice(1);






    //COMMANDS



    //Joindeserver
    if (command === `${prefix}joindeserver`) {

        return message.channel.send("@here , Je kan de server weer joinen, veel speelplesier!");
    }


    //WARN COMMAND

    const warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
    if (command === `${prefix}warn`) {
       

        if (!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("Je hebt geen Perms!");
        var user = message.guild.member(message.mentions.users.first() || message.guild.members.get(arguments[0]));

        if (!user) return message.channel.send("gebruiker is niet gevonden");
        if (user.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Deze gebruiker kan je niet warnen");

        var reason = arguments.join(" ").slice(22);

        if (!reason) return message.channel.send("Je moet een reden opgeven!");

        if (!warns[user.id]) warns[user.id] = {
            warns: 0
        };

        warns[user.id].warns++;

        fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
            if (err) console.log(err);

        });

        var warnEmbed = new discord.RichEmbed()
            .setDescription("warn")
            .setColor("#ff1100")
            .addField("warned gebruiker", user)
            .addField("Gewarnd door", message.author)
            .addField("Aantal warns", warns)
            .addField("Reden", reason);


        var warnChannel = message.guild.channels.find(x => x.name === "warns");
        if (!warnChannel) return message.guild.send("kan kanaal niet vinden");

        warnChannel.send(warnEmbed);


    }

    //BAN COMMAND 

    if (command === `${prefix}ban`) {

        var banUser = message.guild.member(message.mentions.users.first() || message.guild.members(arguments[0]));

        if (banUser) return message.channel.send("gebruiker is niet gevonden");

        var reason = arguments.join(" ").slice(22);
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Sorry, probeer dit niet opnieuw, je hebt geen bevoegdheid");

        if (banUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Deze gebruiker kan je niet bannen");

        var ban = new discord.RichEmbed()
            .setDescription("ban")
            .setColor("#ff1100")
            .addField("baned gebruiker", banUser)
            .addField("Geband door", message.author)
            .addField("Reden", reason);

        var banChannel = message.guild.channels.find("name", "discord-bans");
        if (banChannel) return message.guild.send("kan kanaal niet vinden");

        message.guild.member(banUser).ban(reason);

        banChannel.send(ban);

    }

    //TICKET SYSTEEM

    if (command === `${prefix}ticket`) {

        const categoryId = "657207551569428490";

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
            .setFooter("Support kanaal word aangemaakt");

        message.channel.send(embedCreateTicket);

        message.guild.createChannel(userName + "-" + userDiscriminator, "text").then((createdChan) => {

            createdChan.setParent(categoryId).then((settedParent) => {

                settedParent.overwritePermissions(message.guild.roles.find('name', "@everyone"), { "READ_MESSAGES": false });

                settedParent.overwritePermissions(message.author, {

                    "READ_MESSAGES": true, "SEND_MESSAGES": true,
                    "ATTACH_FILES": true, "CONNECT": true,
                    "CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true

                });

                var embedParent = new discord.RichEmbed()
                    .setTitle("Hoi, " + message.author.username.toString())
                    .setDescription("Zet hier je bericht, het staffteam zal zodadelijk naar je kijken!!");

                settedParent.send(embedParent);


            }).catch(err => {

                message.channel.send("Er is iets fout gelopen");
            });

        }).catch(err => {

            message.channel.send("Er is iets fout gelopen");
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

        var suggestieChannel = message.guild.channels.find(x => x.name === "suggestie");
        if (!suggestieChannel) return message.channel.send("Kanaal niet gevonden");

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














});




bot.login(process.env.token);
