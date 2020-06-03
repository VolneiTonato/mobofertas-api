import Chromium from 'chromium'
import Puppetter from 'puppeteer'



const optionsChromium = [
    "--no-sandbox",
    "--headless",
    "--disable-gpu",
    "--disable-translate",
    "--disable-extensions",
    "--disable-background-networking",
    "--safebrowsing-disable-auto-update",
    "--disable-sync",
    "--metrics-recording-only",
    "--disable-default-apps",
    "--no-first-run",
    "--mute-audio",
    "--hide-scrollbars"
]


export async function  BrowserNavigate(url){
    try{

        let browser = await Puppetter.launch({headless: false, args:optionsChromium, executablePath: Chromium.path})

        let page = await browser.newPage()

        await page.goto(`${url}`, {waitUntil: 'networkidle2'})

        return await page.content()

    }catch(err){
        throw err
    }
}