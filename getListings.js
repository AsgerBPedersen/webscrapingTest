const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { request } = require('graphql-request');

const getListings = async i => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${process.env.TARGET_URL}/find?${i != 0 ? `startRecord=${i * 18}&` : ''}minLat=54.1006&minLng=5.8813&maxLat=57.8852&maxLng=15.3956`);
    await page.waitForSelector('.CardList', { timeout: 1000 });

    const body = await page.evaluate(() => {
      return document.querySelector('body').innerHTML;
    });
    const $ = cheerio.load(body);
    $('.AdCard', '.CardList').each(function(i, elem) {
      request('http://localhost:4466', `mutation {createListing(data:{uri:"${$(this).attr('href')}"}){uri}}`).then(data => console.log(data))
    });
    const total = $('strong', '#SearchResultsCounter').text();
    if(i*18+18 > total) {
      return false;
    }
    
    

    await browser.close();
  } catch (error) {
    console.log(error);
  }
  return true;
};

module.exports = getListings;