const fs = require('fs');
const axios = require('axios');
const DB = './db/database.json';



class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map( element => {
            const palabraToArray = element.split(' ');
            const capitalizado =  palabraToArray.map( pl => {
                const palabraToArray = pl.split('');
                palabraToArray.splice(0,1, pl.charAt(0).toUpperCase());
                return palabraToArray.join('');
            });
            return capitalizado.join(' ');
        })
    }


    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language':'es'
        }
    }

    get paramsOpenWeather() {
        return this.params;
    }

    set paramsOpenWeather( value ) {
        this.params = {
            'lat': value.lat,
            'lon': value.lon,
            'appid': process.env.OPENWEATHER_KEY,
            'units':'metric',
            'lang':'es'
        };
    }

    async ciudad( lugar = '' ) {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }))
        } catch (error) {
            return [];
        }
        // peticion http
    }


    async climaLugar( lat, lon ) {
        this.paramsOpenWeather = { lat, lon };
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: this.paramsOpenWeather
            });
            const resp = await instance.get();
            return {
                desc: resp.data.weather[0].description,
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max,
                temp: resp.data.main.temp
            }
        } catch (error) {
            console.log(error);
        }
    }


    agregarHistorial( lugar = '' ){

        if ( this.historial.includes( lugar.toLocaleLowerCase() ) ) {
            return;
        }
        this.historial = this.historial.splice(0,5);


        this.historial.unshift( lugar.toLocaleLowerCase() );

        this.guardarDB();
    }

    guardarDB() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );
    }

    leerDB() {
        if ( !fs.existsSync( DB ) ) {
            return null;
        }

        const info = fs.readFileSync( DB, { encoding: 'utf-8'} );
        const data = JSON.parse( info );
        console.log( data.historial);
        this.historial = data.historial;
    }
}


module.exports = Busquedas;