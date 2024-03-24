const fetch = require('node-fetch');
const setTitle = require('console-title');

class RateLimit {
  constructor(config) {
    console.log('\x1b[32m', 'Başlatılıyor');

    if (!config?.RateLimitToken || !config?.RateLimitGuildID) {
      console.log('\x1b[31m', 'Token veya Guild ID eksik');
      return false;
    }

    setTitle('Rate Limit Checker');

    this.token = config.RateLimitToken;
    this.guildId = config.RateLimitGuildID;

    this.start();
  }

  start = async () => {
    while (true) {
      let response = await this.checkRateLimit();
      let json = await response.json();

      console.log('\x1b[34m', 'DEVELOPED BY MACCER QWE:QW:EQW:QWE:');

      if (json?.retry_after) {
        console.log('\x1b[41m', 'RATELIMIT CHECKER: ' + this.formatTime(Date.now() + json.retry_after) + '');
      } else {
        if (response?.status === 403 || response?.status === 404) {
          console.log('\x1b[31m', 'Bir hata oluştu.');
        } else if (response?.status !== 429) {
          console.log('\x1b[42m', 'RATELIMIT CHECKER: Rate limit yok.');
        }
      }

      await this.sleep(1000);
    }
  };

  checkRateLimit = async () => {
    return await fetch(`https://discord.com/api/v9/guilds/${this.guildId}/vanity-url`, {
      credentials: 'include',
      headers: {
        accept: 'application/json',
        authorization: this.token,
        'Content-Type': 'application/json'
      },
      referrerPolicy: 'no-referrer-when-downgrade',
      body: JSON.stringify({ code: '11' }),
      method: 'PATCH',
      mode: 'cors'
    });
  };

  formatTime = (ms) => {
    return new Date(ms).toISOString().substr(11, 8);
  };

  sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
}

module.exports = RateLimit;

const config = require('./config.json');
const rateLimit = new RateLimit(config);
