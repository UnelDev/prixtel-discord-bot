## Prixtel-discord-bot
Prixtel-discord-bot is a Discord bot that allows users to access information about their Prixtel account directly from Discord. The bot provides a variety of commands that can be used to check the status of the user's account, set up alerts for data usage, view active alerts, and check the status of different services. 

The bot is designed to make it easier for users to manage their Prixtel account without having to navigate through the Prixtel application. It also offers a more convenient way to stay informed about the status of the user's account, such as receiving alerts when data usage is nearing its limit.

## Getting Started
To set up the bot, users will need to:
- Clone the repository
- Run `npm i`
- Create a .env file containing the following variables:
    - **BOT_TOKEN**: the token of your bot
    - **BOT_DEV_TOKEN**: the token of the second bot (the development bot)
    - **EMAIL**: the email linked to your Prixtel account
    - **PASSWORD**: the password for your Prixtel account
    - **APPID**: the app ID
    - **APPID_DEV**: the development app ID
    - **SERVID**: the server ID
    - **SERVID_DEV**: the development server ID
    - **ISDEV**: defines whether the bot is in a development environment or not (true or false)

Example:
- BOT_TOKEN=your_bot_token
- BOT_DEV_TOKEN=your_development_bot_token
- EMAIL=your_prixtel_email
- PASSWORD=your_prixtel_password
- APPID=your_app_id
- APPID_DEV=your_development_app_id
- SERVID=your_server_id
- SERVID_DEV=your_development_server_id
- ISDEV=true

The .env file contains important information for the bot to function properly. It is used to set up the bot's environment and contains variables such as the bot's token, email, password, app ID, server ID, and whether the bot is in a development environment or not. Make sure to keep this file secure and not to share it with anyone.
- The bot also includes scripts for deploying and removing commands, making it easy to manage and update the bot's functionality.
## Scripts
- deploy.js: allows you to deploy the commands passed to it as arguments and is automatically run with main.js
- remove_commands.js: allows you to remove all stored commands from Discord servers.

## Command List
- /report: check the status of your phone plan
- /alert : set up an alert for data usage. Usage: /alert alert:number_of_gigas alert_channel:channel_name ?role:role_to_ping
- /listAlert: lists all active alerts
- /ping: check the status of different services
- /remove_commands: removes all stored commands from the Discord server
- /deploy: deploys the commands passed to it as arguments
