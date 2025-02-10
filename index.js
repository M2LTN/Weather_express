const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

const key = "5599644fba2b60567e2d89ac195babe9"; 
let city = "Tartu"; 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`);
        const data = await response.json();

        let description = data.weather[0].description;
        let cityName = data.name;
        let temp = Math.round(parseFloat(data.main.temp) - 273.15); 

        res.render('index', { 
            description: description, 
            city: cityName, 
            temp: temp 
        });

    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.render('index', { 
            description: "Error retrieving weather data", 
            city: city, 
            temp: "N/A" 
        });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
