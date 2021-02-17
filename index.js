require('dotenv').config()
const {
    inquirerMenu,
    pausa,
    leerInput,
    listadoLugares
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");



const main = async() => {

    const busquedas = new Busquedas();

    let opt;



    do {

        opt = await inquirerMenu();


        switch ( opt ) {
            case 1:
                // mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                // buscar el lugar
                const lugares = await busquedas.ciudad( termino );
                // seleccionar el ugar
                const id = await listadoLugares( lugares );
                if ( id === '0' ) continue;
                const lugarSel = lugares.find( l => l.id === id );

                busquedas.agregarHistorial( lugarSel.nombre );
                // Clima
                const { desc, min, max, temp } = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                // mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad: ', lugarSel.nombre);
                console.log('Lat: ', lugarSel.lat);
                console.log('Lng: ', lugarSel.lng);
                console.log('Temperatura: ', temp);
                console.log('Mínima: ', min);
                console.log('Maxima: ', max);
                console.log('Como está el clima: ', desc);
                break;
            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, index) => {
                    const idx = `${index+1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
            break;
        }




        if ( opt !== 0) await pausa();
    } while ( opt !== 0);
}









main();

