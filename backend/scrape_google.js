const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function scrapeImages() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const query = 'Nike Air Force 1 white background site:stockx.com';
  const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
  
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  const imageUrls = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.map(img => img.src).filter(src => src && (src.startsWith('http') || src.startsWith('data:image')));
  });
  
  console.log(imageUrls[1]); // Often index 1 is the first actual result thumbnail
  await browser.close();
}

scrapeImages();
