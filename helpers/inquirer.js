const inquirer  = require('inquirer');
require('colors');


const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            },
        ]
    }
];


const inquirerMenu = async () => {
    console.clear();
    console.log('==========================='.green);
    console.log(' Selecciones una opción'.white);
    console.log('=========================='.green);

    const { opcion } = await inquirer.prompt( preguntas );

    return opcion
}


const pausa = async() => {

    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Precione ${'ENTER'.green} para continuar`
        }
    ];
    console.log('\n');
    await inquirer.prompt( question );
};


const leerInput = async(message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if ( value.length === 0 ) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const {desc} = await inquirer.prompt( question );
    return desc;
}


const listadoLugares = async( lugares = [] ) => {
    const choices = lugares.map( (lugar, index) => {
        const idx = `${index + 1}`.green;
        return {
            value: lugar.id,
            name: `${idx}. ${lugar.nombre}`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.red + ' Cancelar'
    });
    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Selecciones lugar',
            choices
        }
    ]

    const { id } = await inquirer.prompt( preguntas );
    return id;
}


const mostrarListadoCkeckList = async( tareas = [] ) => {
    const choices = tareas.map( (tarea, index) => {
        const idx = `${index + 1}`.green;
        return {
            value: tarea.id,
            name: `${idx}. ${tarea.desc}`,
            checked: ( tarea.completadoEn ) ? true : false
        }
    });


    const preguntas = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices
        }
    ]

    const { ids } = await inquirer.prompt( preguntas );
    return ids;
}


const confirmar = async( message ) => {
    const pregunta = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const { ok } = await inquirer.prompt( pregunta );
    return ok;
}
module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listadoLugares,
    confirmar,
    mostrarListadoCkeckList
}