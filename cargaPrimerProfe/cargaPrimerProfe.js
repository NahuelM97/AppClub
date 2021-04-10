const configSv = require('./configSv.json');
const PouchDB = require('pouchdb');
const Find = require('pouchdb-find');
const Auth = require('pouchdb-authentication');


PouchDB.plugin(Find);
PouchDB.plugin(Auth);
PouchDB.plugin(require('pouchdb-upsert'));
PouchDB.plugin(Auth);

/*                              LEEME
 * 
 * ESTE SCRIPT ES PARA CARGAR AL PRIMER PROFESOR EN LA BASE DE DATOS Y CREACION DE INDICES
 * 
 * CAMBIAR DATOS A CONTINUACION ANTES DE EJECUTARLO
 * 
 */
////////////////           DATOS                    ///////////////////

const metadata = {
    email: 'aaaa@aaaa.com',     // email del profesor
    nombre: 'User Prueba',   // nombre del profesor
    dni: '12345678',                // dni del profesor
}

const password = "coso";        // password del profesor

//const host = 'couchdb-unmdp.mooo.com';       // host donde esta BD
//const puerto = 6984;            // puerto de BD

const adminUser = "administrator" // usuario admin de la base de datos
const adminPass = "ecaV79Qj"       // clave admin de la base de datos

/////////////////////////////////////////////////////////////////////

const jugadoresDB = new PouchDB(`https://${adminUser}:${adminPass}@${configSv.ip}:${configSv.puerto}/jugadoresdb`);
const usersDB = new PouchDB(`https://${adminUser}:${adminPass}@${configSv.ip}:${configSv.puerto}/_users`);
const pagosDB = new PouchDB(`https://${adminUser}:${adminPass}@${configSv.ip}:${configSv.puerto}/pagosdb`);
const pendientesDB = new PouchDB(`https://${adminUser}:${adminPass}@${configSv.ip}:${configSv.puerto}/usuariospendientesdb`);
const balancesDB = new PouchDB(`https://${adminUser}:${adminPass}@${configSv.ip}:${configSv.puerto}/balancesdb`);

const balance = {
    '_id': '',
    fechaCancelacion: '',
    nombreProfesor: '',
    total: 0,
};

/////// CREACION DE INDICES ///////

    jugadoresDB.createIndex({ index: { fields: ['nombre'], name: "indiceNombre", ddoc: "indiceNombre" } })
    .catch(console.log)

    jugadoresDB.createIndex({ index: { fields: ['categoria'], name: "indiceCat", ddoc: "indiceCat" } })
    .catch(console.log)

    usersDB.createIndex({ index: { fields: ['name'], name: "indiceUser", ddoc: "indiceUser" } })
    .catch(console.log)

    pagosDB.createIndex({ index: { fields: ['dniJugador'], name: "indicePago", ddoc: "indicePago" } })
    .catch(console.log)

    pendientesDB.createIndex({ index: { fields: ['dni'], name: "indicePendiente", ddoc: "indicePendiente" } })
    .catch(console.log)

/////// CREACION DE PRIMER PROFESOR ///////

balancesDB.signUp(metadata.dni, password, {
    metadata: metadata,
    roles: [
        "profesor", "profesor_root"
    ],
}).then(res => {
 
    balance.nombreProfesor = metadata.nombre;
    balance._id = metadata.dni;
    balancesDB.upsert(balance._id, () => balance);
    console.log("Se ha aceptado al usuario pendiente con exito");
}).catch(error => {
    console.log(error);
});