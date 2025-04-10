const { Telegraf, Markup } = require("telegraf");

const axios = require("axios");
require("dotenv").config();

const data = require("./algo.json");

//const OPENAI_API_KEY = process.env.API_KEY;

const getRandomx = (collection) => {
  const randomIndex = Math.floor(Math.random() * (collection.length - 1));
  return collection[randomIndex];
};

const greetings = [
  "👋 Hi there! How can I help?",
  "😊 Hello! What can I do for you?",
  "🤗 Hey! How's it going?",
  "🚀 Hi! Ready to assist you!",
  "🌟 Hello! What brings you here?",
  "🙌 Hey there! Need any help?",
  "💡 Hi! How can I assist?",
  "🎯 Hello! Let’s get started!",
  "🧠 Hi! What’s on your mind?",
  "⚡ Hey! How can I help today?",
  "😃 Hi! Nice to see you!",
  "❓ Hello! What do you need?",
  "💬 Hey! Let’s chat!",
  "🌞 Hi! How’s your day going?",
  "🤝 Hello! How can I support you?",
  "🔥 Hi! What’s up?",
  "✅ Hey! Ready to help!",
  "🔧 Hi! Let’s make things easier!",
  "📅 Hello! How can I assist today?",
  "🤖 Hi! What can I do for you?",
];

function mainMenu(ctx) {
  ctx.reply(
    "📌 Choose an option:",
    Markup.inlineKeyboard([
      [Markup.button.callback("😂 Joke", "joke")],
      [Markup.button.callback("📚 Algorithm", "algorithm")],
      [Markup.button.callback("ℹ️ WebSearch", "WebSearch")],
    ])
  );
}

function helpMenu(ctx) {
  ctx.reply(
    `📖 *Help Menu*  
        
        Here are the available commands:  

        🔹 */start* \\- Start the bot   
        🔹 */help* \\- Show this help message  
        🔹 */joke* \\- Get a random joke  
        🔹 */algorithm* \\- Algorithms of sorting  

        Click a button below to explore\\! ⬇️`
  );
}

const handleJokeCommand = async (ctx) => {
  try {
    const response = await axios.get(" https://sv443.net/jokeapi/v2/joke/Any");
    console.log(response.data);
    const joke = response.data;
    const jokeText = `${joke.setup}\n${joke.delivery}`;

    ctx.reply(jokeText);
  } catch (error) {
    ctx.reply("⚠️ *Failed to fetch a joke. Try again!*");
  }
};

try {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  bot.start((ctx) => {
    ctx.reply(getRandomx(greetings));
    setTimeout(() => {
      mainMenu(ctx);
    }, 2000);
  });

  bot.help((ctx) => {
    helpMenu(ctx);
  });
  bot.telegram.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "help", description: "Show help menu" },
    { command: "joke", description: "Get a random joke" },
    { command: "algorithm", description: "Algorithms info" },
  ]);

  bot.action("help", (ctx) => helpMenu(ctx));

  bot.command("joke", handleJokeCommand);

  bot.command("algorithm", async (ctx) => {
    try {
      const query = ctx.message.text.split(" ")[1];
      if (!query) {
        return ctx.reply(
          "Please specify an algorithm name. Usage: /algorithm <name>"
        );
      }

      if (Object.keys(data.algorithms).includes(query)) {
        const response = await axios.get(data.algorithms[query]);
        ctx.reply(response.data);
      } else {
        ctx.reply("Requested algorithm not available.");
      }
    } catch (error) {
      console.error("Error in /algorithm:", error.message);
      ctx.reply(
        "Oops! Something went wrong while fetching the algorithm info."
      );
    }
  });

  bot.hears("hi", (ctx) => ctx.reply("Hey there!"));

  bot.on("sticker", (ctx) => ctx.reply("❤️"));

  const app = express();
  app.get("/", (req, res) => {
    res.send("Bot is running!");
  });
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });

  // bot.on('text', async (ctx) => {
  //   const userMessage = ctx.message.text;

  //   try {
  //     // Send "typing..." action
  //     await ctx.sendChatAction('typing');

  //     const response = await axios.post(
  //       `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
  //       {
  //         contents: [
  //           {
  //             parts: [
  //               { text: userMessage }
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );

  //     const geminiReply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

  //     if (geminiReply) {
  //       await ctx.reply(geminiReply);
  //     } else {
  //       await ctx.reply('Hmm... I could not generate a reply. Try again!');
  //     }

  //   } catch (error) {
  //     console.error('Error calling Gemini API:', error.response ? error.response.data : error.message);
  //     await ctx.reply('Sorry, something went wrong while contacting Gemini.');
  //   }
  // });

  bot.launch();

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
} catch (error) {
  console.log(error);
}
