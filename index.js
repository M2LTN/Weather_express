import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const key = //ei pane siia oma api sest see security risk; 

const getWeatherData = (city) => {
    return new Promise((resolve, reject) => {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
        
        fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            let description = data.weather[0].description
            let city = data.name
            let temp = Math.round(parseFloat(data.main.temp) - 273.15)
            const result = {
                description: description,
                city: city,
                temp: temp,
                error: null
            }
            resolve(result)
        })
        .catch(error => {
            console.error(error);
            reject(error)
        })
    })
}

app.all('/', (req, res) => {
    let city;
    if (req.method == 'GET') {
        city = 'Tartu';
    } else if (req.method == 'POST') {
        city = req.body.cityname;
    }
    
    getWeatherData(city)
    .then((data) => {
        res.render('index', data);
    })
    .catch(error => {
        res.render('index', {
            error: 'Problem with getting data, try again...'
        })
    })
    
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

// Removed redundant app.get route

app.post("/", (req,res) => {
    let city = req.body.cityname
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        let description = data.weather[0].description
        let city = data.name
        let temp = Math.round(parseFloat(data.main.temp) - 273.15)
        res.render('index', {
            description: description,
            city: city,
            temp: temp
        })
    })
})

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
