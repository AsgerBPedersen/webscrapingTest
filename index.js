const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { request } = require('graphql-request');
const getListings = require('./getListings');
const getHome = require('./getHome');
const getCords = require('./getCords');
require('dotenv').config();

// (async () => {
//   let next = true;
//   let i = 0;
//   while (next) {
//     next = await getListings(i);
//     i = i+1;
//   } 
// })()

// (async () => {
//   let count=0;
//  await request('http://localhost:4466', `{
//   listingsConnection {
//     aggregate {
//       count
//     }
//   }
// }`).then(data => {count = data.listingsConnection.aggregate.count});

// for (let index = 0; index*100 < count; index++) {
//   await request('http://localhost:4466', `{
//   listings(first:100 skip:${index*100}) {
//     id
//     uri
//   }
// }`).then(data => getHome(data.listings));
  
// }
// })();

(async () => {
  let count=0;
 await request('http://localhost:4466', `{
  homesConnection {
    aggregate {
      count
    }
  }
}`).then(data => {count = data.homesConnection.aggregate.count});

for (let index = 0; index*100 < count; index++) {
  await request('http://localhost:4466', `{
  homes(first:100 skip:${index*100}) {
    id
    address
  }
}`).then(data => getCords(data.homes));
  
}
})();

