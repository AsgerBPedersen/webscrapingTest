const { request } = require('graphql-request');
const utf8 = require('utf8');


const timeout = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getCords = async (homes) => {
    for (let index = 0; index < homes.length; index++) {
        const element = homes[index];
        const api = `https://eu1.locationiq.com/v1/search.php?key=${process.env.GEOLOCATION_APIKEY}&q=${element.address}&viewbox=7.7254,53.6710,15.4383,57.8654&bounded=1&format=json`;
        console.log(utf8.encode(api));
        await timeout(1000);
        const response = await fetch(utf8.encode(api))
        .then(res => res.json())
        .then(local => {
            console.log(local[0])

            request('http://localhost:4466',`mutation {
            updateHome(where: { id: "${element.id}" }, data: { lat: "${local[0].lat}", lon: "${local[0].lon}" }) {
              id
              lat
              lon
            }
          }`).then(data => console.log(data))
        }).catch(err => console.log(err));
        
        
    }
}

module.exports = getCords;
  