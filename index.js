require("dotenv").config();

const mongoose = require("mongoose");
const URL = require("./models/url");

const {
    Client,
    GatewayIntentBits
} = require("discord.js");

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => console.log("MongoDB connection error:", err));

const client = new Client({          //creating the discord bot
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on("messageCreate", async (message) => {

    if (message.author.bot) return;    //ignore bot msg 

    if (message.content.startsWith("create")) {

        const url = message.content.split("create")[1].trim();

        const shortId = Math.random()
            .toString(36)
            .substring(2, 8);

        await URL.create({
            shortId: shortId,
            redirectURL: url
        });

        return message.reply({
            content: `Short ID generated: ${shortId}`
        });
    }

    if (message.content.startsWith("get")) {

        const shortId = message.content.split("get")[1].trim();

        const entry = await URL.findOne({
            shortId: shortId
        });

        if (!entry) {
            return message.reply({
                content: "Short ID not found."
            });
        }

        return message.reply({
            content: entry.redirectURL
        });
    }

    message.reply({
        content: "Hi From Bot"
    });
});

client.on("interactionCreate", (interaction) => {

    console.log(interaction);

    interaction.reply("pong!");

});

client.login(process.env.DISCORD_TOKEN);   //bot connects to discord