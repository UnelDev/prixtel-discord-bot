import prixtelApi from "./index.js";

async function PrixtelAlert(channelid, timer, alert) {
    const channel = await process.client.channels.cache.get(channelid);
    console.log(channel);
    if (typeof timer != 'number') {
        timer = 5000;
    }

    let initial = await process.api.GetDataConsumme();
    setInterval(() => {
        channel.send(initial);
    }, timer);
}
export default PrixtelAlert;