//is a convetion of my api: https://github.com/UnelDev/Prixtel-API
import puppeteer, { Browser, Page } from 'puppeteer';
import * as dotenv from 'dotenv';
dotenv.config();
export default class prixtelApi {
    browser;
    page;
    constructor() {
        this.browser = puppeteer.launch();
    }
    async Connect(email, password) {
        const page = await (await this.browser).newPage();
        await page.goto('https://espaceclient.prixtel.com/connexion');
        const inputEmail_value = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("#inputEmail"),
                heading => heading.innerText.trim());
        });
        if (inputEmail_value[0] = '') {
            //is already connected
            console.log('already connected');
            return page;
        }
        await page.type('#inputEmail', email);
        await page.type('#inputPassword', password);
        await page.click('.cta_btn');
        await page.waitForSelector('.my-consumption-area');
        this.page = page;
        return page;
    }

    async GetDataUsage(page) {
        if (typeof page == 'undefined') {
            if (typeof this.page != 'undefined') {
                page = this.page;
            } else {
                page = await this.Connect(process.env.EMAIL, process.env.PASSWORD);
            }
        }
        const card_value = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".procedure-card_value "),
                heading => heading.innerText.trim());
        });
        return card_value;
    }

    async GetCallTime(usage) {
        if (typeof usage == 'undefined') {
            usage = await this.GetDataUsage();
        }
        return usage[0];
    }

    async GetsmsSend(usage) {
        if (typeof usage == 'undefined') {
            usage = await this.GetDataUsage();
        }
        return usage[1];
    }

    async GetDataConsumme(usage) {
        if (typeof usage == 'undefined') {
            usage = await this.GetDataUsage();
        }
        return usage[2];
    }

    async GetCo2Save(usage) {
        if (typeof usage == 'undefined') {
            usage = await this.GetDataUsage();
        }
        return usage[3];
    }

    async GetConsumptionLevel(page) {
        if (typeof page == 'undefined') {
            if (typeof this.page != 'undefined') {
                page = this.page;
            } else {
                page = await this.Connect(process.env.EMAIL, process.env.PASSWORD);
            }
        }
        const getLevel = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".shunter-data"),
                heading => heading.innerText.trim());
        });
        //parse result
        const level = [];
        (getLevel).forEach((Element) => {
            if (Element != '0' && Element != '') {
                level.push(Number(Element.split(' ')[0]));
            }
        })
        return level;
    }

    async ActualPrice(page) {
        if (typeof page == 'undefined') {
            if (typeof this.page != 'undefined') {
                page = this.page;
            } else {
                page = await this.Connect(process.env.EMAIL, process.env.PASSWORD);
            }
        }
        const price = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".prixtel-color"),
                heading => (heading).innerText.trim());
        });
        let actual;
        //parse result
        (price).forEach((Element) => {
            if (Element.includes('€')) {
                actual = Element.replace('€', '');
            }
        })
        return actual;
    }

    async getName(page) {
        if (typeof page == 'undefined') {
            if (typeof this.page != 'undefined') {
                page = this.page;
            } else {
                page = await this.Connect(process.env.EMAIL, process.env.PASSWORD);
            }
        }
        let name = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".first-name-title"),
                heading => heading.innerText.trim());
        });
        //parse data
        name[0] = name[0].replace("Bonjour ", "");
        name[0] = name[0].replace("Hello ", "");
        return name[0];
    }

    async getPhoneNumber(page) {
        if (typeof page == 'undefined') {
            if (typeof this.page != 'undefined') {
                page = this.page;
            } else {
                page = await this.Connect(process.env.EMAIL, process.env.PASSWORD);
            }
        }
        let name = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".selected-line-desc"),
                heading => heading.innerText.trim());
        });
        name[0] = name[0].replace('Ligne : ', '');
        name[0] = name[0].replace('sim', '');
        return name[0];
    }
}