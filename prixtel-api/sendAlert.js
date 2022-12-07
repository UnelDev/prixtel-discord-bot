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
    async save() {
        console.log(this.listAlert);
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
        this.timer = (typeof timer != 'number') ? 5000 : timer;
        this.id = id;
        this.initial = initial;
        // if (typeof initial != 'undefined') {
        //     this.initial = initial;
        // } else {
        //     console.log('is undefined');
        //     process.api.GetDataConsumme().then((result) => {
        //         console.log('1');
        //         this.initial = result;
        //         resolve();
        //     });
        //     console.log(this.initial);
        // }
        this.initialTime = initialTime ?? new Date;
    }


    async fetch(create, remove) {
        const channel = await process.client.channels.cache.get(this.channelid);
        if (typeof timer != 'number') {
            this.timer = 5000;
        }
        this.initial = this.initial.replace(' Go', '');
        setInterval(async () => {
            let newData = await process.api.GetDataConsumme();
            newData = newData.replace(' Go', '');
            if (parseFloat(this.initial) + parseFloat(this.alert) <= newData) {
                channel.send(this.PingRole + ' un palier vien d\'etre déclancher vous avez consomé plus de' + this.alert + 'Go depuis le ' + initialTime.toLocaleDateString('fr-FR'));
                create(this.channelid, this.alert, this.PingRole, this.timer);
                remove(this.id);
            }
        }, this.timer);
    }
}