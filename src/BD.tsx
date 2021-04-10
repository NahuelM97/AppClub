import PouchDB from 'pouchdb'; 
import Find from 'pouchdb-find';
import Auth from 'pouchdb-authentication'
import { iJugador, DEPORTES, GENEROS, CATEGORIAS } from './interfaces';
import configSv from './configSv.json';
PouchDB.plugin(Find);
PouchDB.plugin(Auth);
PouchDB.plugin(require('pouchdb-upsert'));
PouchDB.plugin(require('pouchdb-authentication'));


//  LEEME:
//Para que la aplicacion funcione correctamente, el documento _design/_auth de la base de datos _users debe estar
//como se indica en el archivo auth.txt de este proyecto. Esto es una configuracion adicional que se le ha hecho
//a la configuracion por defecto del plugin pouchdb-authentication.

class BaseDatos {

    private static instance: BaseDatos;

    private jugadoresDB!: PouchDB.Database<{}>;
    private profesoresDB!: PouchDB.Database<{}>;
    private usersDB!: PouchDB.Database<{}>;
    private pagosDB!: PouchDB.Database<{}>;
    private balancesDB!: PouchDB.Database<{}>;
    private historialBalancesDB!: PouchDB.Database<{}>;
    private pendientesDB!: PouchDB.Database<{}>;

    private cat1fDB!: PouchDB.Database<{}>; 
    private cat1mDB!: PouchDB.Database<{}>; 
    private cat5DB!: PouchDB.Database<{}>; 
    private cat7DB!: PouchDB.Database<{}>; 
    private cat9DB!: PouchDB.Database<{}>; 
    private cat11DB!: PouchDB.Database<{}>; 
    private cat13DB!: PouchDB.Database<{}>; 
    private cat15DB!: PouchDB.Database<{}>; 

    constructor() {

        if (!BaseDatos.instance) {

            /* creacion de cada bd */

            this.jugadoresDB = new PouchDB(`${configSv.ip}:${configSv.puerto}/jugadoresdb`);
            this.usersDB = new PouchDB(`${configSv.ip}:${configSv.puerto}/_users`);

            this.balancesDB = new PouchDB(`${configSv.ip}:${configSv.puerto}/balancesdb`);
            this.pagosDB = new PouchDB(`${configSv.ip}:${configSv.puerto}/pagosdb`);
            this.historialBalancesDB = new PouchDB(`${configSv.ip}:${configSv.puerto}/historialbalancesdb`);
            this.pendientesDB = new PouchDB(`${configSv.ip}:${configSv.puerto}/usuariospendientesdb`);

            this.cat1fDB = new PouchDB(`${configSv.ip}:${configSv.puerto}/asist1f`);
            this.cat1mDB = new PouchDB(`${configSv.ip}:${configSv.puerto}/asist1m`);
            this.cat5DB = new PouchDB(`${configSv.ip}:${configSv.puerto}/asist5`);
            this.cat7DB = new PouchDB(`${configSv.ip}:${configSv.puerto}/asist7`);
            this.cat9DB = new PouchDB(`${configSv.ip}:${configSv.puerto}/asist9`);
            this.cat11DB = new PouchDB(`${configSv.ip}:${configSv.puerto}/asist11`);
            this.cat13DB = new PouchDB(`${configSv.ip}:${configSv.puerto}/asist13`);
            this.cat15DB = new PouchDB(`${configSv.ip}:${configSv.puerto}/asist15`);


            BaseDatos.instance = this;
        }

        return BaseDatos.instance;
    }

    /* getters para las diferentes bd */

    getJugadoresDB() {
        return this.jugadoresDB;
    }


    getProfesoresDB() {

        /* NO ES UN ERROR DEVOLVER BALANCES, SIMPLEMENTE ES PARA PODER 
           ACCEDER A LOS METODOS DEL PLUG-IN AUTHENTICATOR, QUE PUEDEN
           SER ACCEDIDOS DESDE CUALQUIER INSTANCIA DE POUCHDB Y QUE SIRVEN 
           PARA EL MANEJO DE USUARIOS */

        return this.balancesDB;
    }

    getUsersDB() {
        return this.usersDB;
    }

    getPagosDB() {
        return this.pagosDB;
    }

    getBalancesDB() {
        return this.balancesDB;
    }

    getHistorialBalancesDB() {
        return this.historialBalancesDB;
    }

    getPendientesDB() {
        return this.pendientesDB;
    }

    getCat1fDB() {
        return this.cat1fDB;
    }
    getCat1mDB() {
        return this.cat1mDB;
    }
    getCat5DB() {
        return this.cat5DB;
    }
    getCat7DB() {
        return this.cat7DB;
    }
    getCat9DB() {
        return this.cat9DB;
    }
    getCat11DB() {
        return this.cat11DB;
    }
    getCat13DB() {
        return this.cat13DB;
    }
    getCat15DB() {
        return this.cat15DB;
    }

    calcularCategoria(jugador: iJugador) {

        let categoria = 0;

        if (jugador.deportes.includes(DEPORTES.futbol)) {

            const edad = new Date().getFullYear() - new Date(jugador.fechaNacimiento).getUTCFullYear();

            if (jugador.genero === GENEROS.femenino && edad >= 15)
                categoria = CATEGORIAS.primeraFemenina;
            else if (jugador.genero === GENEROS.masculino && edad >= 18)
                categoria = CATEGORIAS.primeraMasculina;
            else if (jugador.genero === GENEROS.masculino && edad === 17)
                categoria = CATEGORIAS.quinta;
            else if (jugador.genero === GENEROS.masculino && (edad === 15 || edad === 16))
                categoria = CATEGORIAS.septima;
            else if (edad === 13 || edad === 14)
                categoria = CATEGORIAS.novena;
            else if (edad === 11 || edad === 12)
                categoria = CATEGORIAS.undecima;
            else if (edad === 9 || edad === 10)
                categoria = CATEGORIAS.decimoTercera;
            else
                categoria = CATEGORIAS.decimoQuinta;
        }

        return categoria;
    }
}
const BD = new BaseDatos();
Object.freeze(BD);

export default BD;