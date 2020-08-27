const Bot = require("node-telegram-bot-api");
const token = require("./token");
const makeRequest = require("./req")

const bot = new Bot(token, { polling: true });

const chatId = 110977135;

let interval;

bot.onText(/\/start/, () => {
  bot.sendMessage(chatId,'started');

  interval = setInterval(() => {
    makeRequest(function(err, data) {
        if (err) {
            bot.sendMessage(chatId, err.message);
        }

        if (data[0].count_tickets_lpu > 0) {
            bot.sendMessage(chatId, data[0].count_tickets_lpu)
        }
    });
  }, 1000 * 60 * 10) 
})

bot.onText(/\/stop/, () => {
  clearInterval(interval);

  bot.sendMessage(chatId, "stopped");
})

bot.onText(/\/total/, (msg) => {
  makeRequest(function(err, data) {
    if (err) {
      bot.sendMessage(chatId, err.message);
    }

    bot.sendMessage(chatId, data[0].count_tickets_lpu)
  });
});

bot.onText(/\/by_day/, (msg) => {
  makeRequest(function(err, data) {
    if (err) {
      bot.sendMessage(chatId, err.message);
    }

    bot.sendMessage(chatId, getTicketsByDay(data[0]))
  });
});

bot.on("polling_error", (err) => console.log(err));


function getTicketsByDay(data) {
  return data.doctors.map(doc => {
    return {
      displayName: doc.displayName,
      weeks: doc.week1.concat(doc.week2)
    } 
  }).map(doc => {
    const days = doc.weeks.map(day => `${day.date} ${day.day}: ${day.count_tickets}\n`);
    return `${doc.displayName}\n ${days.join(' ')}`
  }).join('\n');
}
