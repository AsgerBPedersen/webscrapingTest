const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { request } = require('graphql-request');

const getHome = async (listings) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage()
      
      for (let index = 0; index < listings.length; index++) {
        await page.goto(`${process.env.TARGET_URL}${listings[index].uri}`);
        await page.waitForSelector('.AdFeatures', { timeout: 1000 });
        console.log(listings[index].uri);
        const body = await page.evaluate(() => {
          return document.querySelector('body').innerHTML;
        });
        const $ = cheerio.load(body);
        const title = $('.AdDetail__header-heading-primary').text();
        console.log(title);
        const address = $('.AdDetail__header-heading-sub').text();
        console.log(address);
        const descriptionTitle = $('.AdDetail__contents-details-title').text();
        console.log(descriptionTitle)
        const description = $('p','.SmartTextContainer').text().replace(/\s+/g, " ").replace(/"/g, '')
        console.log(description);
        const price = $('.AdFeatures__item-label').filter(function() {
          return $(this).text().trim() === 'Månedlig leje';
        }).next().text();
        console.log(price);
        const type = $('.AdFeatures__item-label').filter(function() {
          return $(this).text().trim() === 'Boligtype';
        }).next().text();
        console.log(type);
        const rooms = $('.AdFeatures__item-label').filter(function() {
          return $(this).text().trim() === 'Værelser';
        }).next().text();
        console.log(rooms);
        const size = $('.AdFeatures__item-label').filter(function() {
          return $(this).text().trim() === 'Størrelse';
        }).next().text();
        console.log(size);
        
        request('http://localhost:4466', `mutation {
            createHome(
              data: {
                title: "${title}"
                address: "${address}"
                descriptionTitle: "${descriptionTitle}"
                description: "${description}"
                price: "${price}"
                type: "${type}"
                size: "${size}"
                rooms: "${rooms}"
              }
            ) {
              id
            }
          }`).then(data => console.log(data))

    }
      
  
      await browser.close();
    } catch (error) {
      console.log(error);
    }
  }

module.exports = getHome;