async function PrixtelAlert(channelid, alert, role, timer) {
    const channel = await process.client.channels.cache.get(channelid);
    if (typeof timer != 'number') {
        timer = 5000;
    }

    let initial = await process.api.GetDataConsumme();
    let initialTime = new Date;
    initial = initial.replace(' Go', '');
    setInterval(async () => {
        let newData = await process.api.GetDataConsumme();
        newData = newData.replace(' Go', '');
        console.log(parseFloat(initial) + parseFloat(alert), '<=', newData, parseFloat(initial) + parseFloat(alert) <= newData)
        if (parseFloat(initial) + parseFloat(alert) <= newData) {
            channel.send(role + ' un palier vien d\'etre déclancher vous avez consomé plus de' + alert + 'Go depuis le ' + initialTime.toLocaleDateString('fr-FR'));
            initial = newData;
            initialTime = new Date();
        }
    }, timer);
}
export default PrixtelAlert;