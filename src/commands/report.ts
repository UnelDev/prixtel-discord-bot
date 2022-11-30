import { CommandInteraction, Embed, EmbedBuilder, Message } from "discord.js";
import type { SimpleCommandMessage } from "discordx";
import {
  Discord,
  SimpleCommand,
  SimpleCommandOption,
  SimpleCommandOptionType,
  Slash,
} from "discordx";

@Discord()
export class report {
  // make single handler for simple and slash command
  likeIt(command: CommandInteraction | Message): void {
    const api = new Prixte
    const embed = new EmbedBuilder()
      .setFooter({ text: `ces information peuvent-être dépasser` })
      .setTitle("**raport de consomation**")
      .addFields({
        name: "donée mobile",
        value: ``,
      });
    command.reply("I like it, Thanks");
  }

  @Slash({ description: "fait un raport de la consomation de Énée", name: "report" })
  slashLikeIt(command: CommandInteraction): void {
    this.likeIt(command);
  }
}
