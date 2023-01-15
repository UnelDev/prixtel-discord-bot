## Prixtel-discord-bot
Prixtel-discord-bot is a project that allows you to avoid using the Prixtel application, but to have the information directly from Discord. It has several commands, such as /report, /alert, /listAlert, and /ping.

## Getting Started
To set up the bot, you will need to:
- Clone the repo
- Run `npm i`
- Add a .env file containing:

```
BOT_TOKEN=your_bot_token
BOT_DEV_TOKEN=your_development_bot_token
EMAIL=your_prixtel_email
PASSWORD=your_prixtel_password
APPID=your_app_id
APPID_DEV=your_development_app_id
SERVID=your_server_id
SERVID_DEV=your_development_server_id
ISDEV=true_or_false
```

## Scripts
- deploy.js: allows you to deploy the commands passed to it as arguments and is automatically run with main.js
- remove_commands.js: allows you to remove all stored commands from Discord servers.

## Command List
- /report: check the status of your package
- /alert alert: number of gigas alert_channel: the channel in which alerts are sent ?role: role to ping when an alert is sent
- /listAlert: lists all alerts currently being processed
- /ping: allows you to know the status of different services
- /remove_commands: removes all stored commands from Discord servers
- /deploy: deploys the commands passed to it as arguments
