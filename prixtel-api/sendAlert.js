import fs from 'node:fs';
import path from 'node:path';
export default class Alert {
    constructor() {
        this.listAlert = [];
    }
    async alert(channelid, alert, role, timer) {
        //create new alert comp and add in list
        const id = this.listAlert.length
        this.listAlert.push(new alertComp(channelid, alert, role, timer, id, await process.api.GetDataConsumme()));
        //start
        this.listAlert[id].fetch(this.save, this.removeAlert);
        this.save();
        return id;
    }
    removeAlert(id) {
        // delete object
        delete this.listAlert[id];
        // delet pointer in array
        this.listAlert.splice(id, 1);
        this.save();
    }
    listAlertObejct() {
        let text = 'voici les alerte active : \n';
        this.listAlert.forEach((Element, i) => {
            if (Element.role) {
                text += ('  alerte n°' + i + ': ping les utilisateur avec le role ' + Element.role + ' dans le chanel ' + Element.channel + ' tout les ' + Element.alert + 'Go\n');
            } else {
                text += ('  alerte n°' + i + ': envoie un mesage dans le chanel ' + Element.channel + ' tout les ' + Element.alert + 'Go\n');
            }
        });
        return text;
    }
    async save() {
        // use absolut path for 'save'
        const saveDir = path.resolve('./save');

        // verify if 'save' exist and create it if dosn't exist
        fs.access(saveDir, error => {
            if (error) {
                // the directory dosn't exist
                fs.mkdir(saveDir, err => {
                    if (err) {
                        throw err;
                    }
                });
            }
            //write 'alertSave.json'
            fs.writeFile(path.resolve(saveDir, 'alertSave.json'), JSON.stringify(this), err => {
                if (err) {
                    throw err;
                }
            });

        });
    }
    async restore() {
        // use absolut path for 'save'
        const saveDir = path.resolve('./save');
        fs.readFile(path.resolve(saveDir, 'alertSave.json'), 'utf8', (err, data) => {
            if (err) {
                console.log('no save detected');
                return;
            }
            this.listAlert = JSON.parse(data).listAlert;
            this.listAlert.forEach((Element, i) => {
                this.listAlert[i] = new alertComp(Element.channel, Element.alert, Element.PingRole, Element.timer, i, Element.initial, Element.initialTime);
                this.listAlert[i].fetch(this.save, this.removeAlert);
            })
        });
    }
}

class alertComp {
    constructor(channelid, alert, role, timer, id, initial, initialTime) {
        this.channel = channelid;
        this.alert = alert;
        this.PingRole = role;
        this.timer = (typeof timer != 'number') ? 900000 : timer;
        this.id = id;
        this.initial = initial;
        this.initialTime = initialTime ?? new Date;
    }

    saveData(date, DataConsumme) {
        // use absolut path for 'save'
        const saveDir = path.resolve('./save');
        fs.readFile(path.resolve(saveDir, 'saveData.json'), 'utf8', (err, content) => {
            let data = [];
            if (err) {
                console.log('no save detected');
            } else {
                data = JSON.parse(content);
                if (!Array.isArray(data)) {
                    console.log('/!\\ file corupt!!!');
                }
            }

            data.push([date, DataConsumme]);


            // verify if 'save' exist and create it if dosn't exist
            fs.access(saveDir, error => {
                if (error) {
                    // the directory dosn't exist
                    fs.mkdir(saveDir, err => {
                        if (err) {
                            throw err;
                        }
                    });
                }
                //write 'alertSave.json'
                fs.writeFile(path.resolve(saveDir, 'saveData.json'), JSON.stringify(data), err => {
                    if (err) {
                        throw err;
                    }
                });
            });

        });
    }
    async fetch(create, remove) {
        const channel = await process.client.channels.cache.get(this.channelid);
        if (typeof timer != 'number') {
            this.timer = 900000;
        }
        this.initial = this.initial.replace(' Go', '');
        setInterval(async () => {
            let newData = await process.api.GetDataConsumme();
            newData = newData.replace(' Go', '');
            if (parseFloat(this.initial) > newData) {
                try {
                    await channel.send(this.PingRole + ' votre  forfait a été réinitialiser vous avez consomée ' + newData);
                } catch (error) {
                    console.log('error in fetch sending: ' + error)
                }
                this.initial = newData;
            }
            else if (parseFloat(this.initial) + parseFloat(this.alert) <= newData) {
                try {
                    await channel.send(this.PingRole + ' un palier vien d\'etre déclancher vous avez consomé plus de' + this.alert + 'Go depuis le ' + initialTime.toLocaleDateString('fr-FR'));
                } catch (error) {
                    console.log('error in fetch sending: ' + error)
                }
                create(this.channelid, this.alert, this.PingRole, this.timer);
                remove(this.id);
            }
            this.saveData(new Date, newData);
        }, this.timer);
    }
}