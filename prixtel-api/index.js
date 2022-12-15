//is a convetion of my api: https://github.com/UnelDev/Prixtel-API
import puppeteer, { Browser, Page } from 'puppeteer';
import * as dotenv from 'dotenv';
dotenv.config();
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export default class prixtelApi {
    browser;
    page;
    constructor() {
        if (process.env.ISDEV == 'false') {
            this.browser = puppeteer.launch({
                headless: true,
                executablePath: '/usr/bin/chromium-browser',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        } else {
            // this.browser = puppeteer.launch({ headless: false });
            this.browser = puppeteer.launch();
        }
    }
    async Connect(email, password) {
        const page = await (await this.browser).newPage();
        await page.goto('https://espaceclient.prixtel.com/connexion');
        await page.waitForSelector('#inputEmail');
        const inputEmail_value = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("#inputEmail"),
                heading => heading.innerText.trim());
        });
        if (inputEmail_value != '' || inputEmail_value == []) {
            return page;
        }
        if (!inputEmail_value) {
            console.log('error with api, #inputEmail is nothing')
        }
        await page.type('#inputEmail', email);
        await page.type('#inputPassword', password);
        await page.click('.cta_btn');
        await page.waitForSelector('.my-consumption-area');
        this.page = page;
        console.log('connected at prixtel');
        return page;
    }

    async Refresh(page) {
        let consumption_area_value = ' ';
        if (page) {
            consumption_area_value = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".my-consumption-area"),
                    heading => heading.innerText.trim());
            });
        }
        if (!page || consumption_area_value == '') {
            page = await this.Connect(process.env.EMAIL, process.env.PASSWORD);
        } else {
            await page.reload();
            await page.waitForSelector('.my-consumption-area');
        }
        this.page = page;
        return page;
    }

    async ping(page) {
        if (!page) {
            if (this.page) {
                page = this.page;
            } else {
                page = await this.Connect(process.env.EMAIL, process.env.PASSWORD);
            }
        }
        const time1 = new Date();
        await this.Refresh(page);
        const RefreshTime = new Date() - time1;
        await this.disconnect(page);
        const time2 = new Date();
        await this.Connect(process.env.EMAIL, process.env.PASSWORD);
        const connectTime = new Date() - time2;
        return { RefreshTime: RefreshTime, connectTime: connectTime };
    }
    async disconnect(page) {
        if (page) {
            await page.close();
        }
        page = await (await this.browser).newPage();
        await page.goto('https://espaceclient.prixtel.com/connexion');
        const inputEmail_value = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("#inputEmail"),
                heading => heading.innerText.trim());
        });
        if (inputEmail_value != '') {
            return page;
        }
        if (!inputEmail_value) {
            console.log('error with api, #inputEmail is nothing')
        }
        console.log('disconnected');
    }
    async GetDataUsage(page) {
        if (!page) {
            if (this.page) {
                page = this.page;
            } else {
                page = await this.Connect(process.env.EMAIL, process.env.PASSWORD);
            }
        }
        page = await this.Refresh(page);
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