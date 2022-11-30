//use my api for prixtel : https://github.com/UnelDev/Prixtel-API
import puppeteer, { Browser, Page } from 'puppeteer';
require('dotenv').config({ path: __dirname + '/.env' });
class prixtelApi {
    browser: Promise<Browser>;
    page: Page | undefined;
    constructor() {
        this.browser = puppeteer.launch();
    }
    async Connect(email: string, password: string) {
        const page = await (await this.browser).newPage();
        await page.goto('https://espaceclient.prixtel.com/connexion');
        const inputEmail_value = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("#inputEmail"),
                heading => (heading as any).innerText.trim());
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

    async GetDataUsage(page?: Page) {
        if (typeof page == 'undefined') {
            if (typeof this.page != 'undefined') {
                page = this.page;
            } else {
                page = await this.Connect(process.env.EMAIL as string, process.env.PASSWORD as string);
            }
        }
        const card_value = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".procedure-card_value "),
                heading => (heading as any).innerText.trim());
        });
        return card_value;
    }

    async GetCallTime(usage?: Array<string>) {
        if (typeof usage == 'undefined') {
            usage = await this.GetDataUsage();
        }
        return usage[0];
    }

    async GetsmsSend(usage?: Array<string>) {
        if (typeof usage == 'undefined') {
            usage = await this.GetDataUsage();
        }
        return usage[1];
    }

    async GetDataConsumme(usage?: Array<string>) {
        if (typeof usage == 'undefined') {
            usage = await this.GetDataUsage();
        }
        return usage[2];
    }

    async GetCo2Save(usage?: Array<string>) {
        if (typeof usage == 'undefined') {
            usage = await this.GetDataUsage();
        }
        return usage[3];
    }

    async GetConsumptionLevel(page?: Page) {
        if (typeof page == 'undefined') {
            if (typeof this.page != 'undefined') {
                page = this.page;
            } else {
                page = await this.Connect(process.env.EMAIL as string, process.env.PASSWORD as string);
            }
        }
        const getLevel = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".shunter-data"),
                heading => (heading as any).innerText.trim());
        });
        //parse result
        const level: Array<Number> = [];
        (getLevel as Array<string>).forEach((Element) => {
            if (Element != '0' && Element != '') {
                level.push(Number(Element.split(' ')[0]));
            }
        })
        return level;
    }

    async ActualPrice(page?: Page) {
        if (typeof page == 'undefined') {
            if (typeof this.page != 'undefined') {
                page = this.page;
            } else {
                page = await this.Connect(process.env.EMAIL as string, process.env.PASSWORD as string);
            }
        }
        const price = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".prixtel-color"),
                heading => (heading as any).innerText.trim());
        });
        let actual;
        //parse result
        (price as Array<String>).forEach((Element) => {
            if (Element.includes('€')) {
                actual = Element.replace('€', '');
            }
        })
        return actual;
    }

    async getName(page?: Page) {
        if (typeof page == 'undefined') {
            if (typeof this.page != 'undefined') {
                page = this.page;
            } else {
                page = await this.Connect(process.env.EMAIL as string, process.env.PASSWORD as string);
            }
        }
        let name = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".first-name-title"),
                heading => (heading as any).innerText.trim() as String);
        });
        //parse data
        name[0] = name[0].replace("Bonjour ", "");
        name[0] = name[0].replace("Hello ", "");
        return name[0];
    }

    async getPhoneNumber(page?: Page) {
        if (typeof page == 'undefined') {
            if (typeof this.page != 'undefined') {
                page = this.page;
            } else {
                page = await this.Connect(process.env.EMAIL as string, process.env.PASSWORD as string);
            }
        }
        let name = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".selected-line-desc"),
                heading => (heading as any).innerText.trim() as String);
        });
        name[0] = name[0].replace('Ligne : ', '');
        name[0] = name[0].replace('sim', '');
        return name[0];
    }
}

export default prixtelApi;