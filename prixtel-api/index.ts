import puppeteer, { Page } from 'puppeteer';
require('dotenv').config({ path: __dirname + '../.env' });

const browser = puppeteer.launch();

async function Connect(email: string, password: string) {
    const page = await (await browser).newPage();
    await page.goto('https://espaceclient.prixtel.com/connexion');
    await page.type('#inputEmail', email);
    await page.type('#inputPassword', password);
    await page.click('.cta_btn');
    await page.waitForSelector('.my-consumption-area');
    console.log('Connected');
    return page;
}

async function GetDataUsage(page?: Page) {
    if (typeof page == 'undefined') {
        page = await Connect(process.env.EMAIL as string, process.env.PASSWORD as string);
    }
    const card_value = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".procedure-card_value "),
            heading => (heading as any).innerText.trim());
    });
    return card_value;
}

async function GetCallTime(usage?: Array<string>) {
    if (typeof usage == 'undefined') {
        usage = await GetDataUsage();
    }
    return (usage as string[])[0];
}

async function GetsmsSend(usage?: Array<string>) {
    if (typeof usage == 'undefined') {
        usage = await GetDataUsage();
    }
    return (usage as string[])[1];
}

async function GetDataConsumme(usage?: Array<string>) {
    if (typeof usage == 'undefined') {
        usage = await GetDataUsage();
    }
    return (usage as string[])[2];
}

async function GetCo2Save(usage?: Array<string>) {
    if (typeof usage == 'undefined') {
        usage = await GetDataUsage();
    }
    return (usage as string[])[3];
}

async function GetConsumptionLevel(page?: Page) {
    if (typeof page == 'undefined') {
        page = await Connect(process.env.EMAIL as string, process.env.PASSWORD as string);
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

async function ActualPrice(page?: Page) {
    if (typeof page == 'undefined') {
        page = await Connect(process.env.EMAIL as string, process.env.PASSWORD as string);
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

async function getName(page?: Page) {
    if (typeof page == 'undefined') {
        page = await Connect(process.env.EMAIL as string, process.env.PASSWORD as string);
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

async function getPhoneNumber(page?: Page) {
    if (typeof page == 'undefined') {
        page = await Connect(process.env.EMAIL as string, process.env.PASSWORD as string);
    }
    let name = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".selected-line-desc"),
            heading => (heading as any).innerText.trim() as String);
    });
    name[0] = name[0].replace('Ligne : ', '');
    name[0] = name[0].replace('sim', '');
    return name[0];
}

export default { getPhoneNumber, getName, ActualPrice, GetConsumptionLevel, GetCo2Save, GetDataConsumme, GetsmsSend, GetCallTime, GetDataUsage, Connect }