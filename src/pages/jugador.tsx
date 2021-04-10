import React from 'react';
import { IonPage, IonContent, IonItem, IonLabel, IonButton, IonIcon, IonAlert, IonRow, IonGrid, IonCol, IonInput, IonDatetime, IonSelect, IonSelectOption, IonToast } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { call } from 'ionicons/icons';
import '../theme/jugador.css';
import { iJugador, CATEGORIAS, DEPORTES, NOMBRE_CAT_FUTBOL, NOMBRE_DEPORTES, regNombre, TIPO_MOVIL, PREFIJO_MOVIL, TIPO_FIJO, NOMBRE_GENEROS, GENEROS } from '../interfaces';
import BD from '../BD';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

type tipoProps = RouteComponentProps<{ dni: string }>;

interface iState {

    jugador: iJugador,
    jugadorTemp: iJugador,
    isReadOnly: boolean,
    mostrarAlerta: boolean,
    tipoTelefono: string,
    toastParams: {
        mostrar: boolean,
        esError: boolean,
        volverCuandoCancela: boolean,
        mensaje: string
    }
};

interface iOpcion {
    nombre: string,
    valor: number,
}

const deportes: iOpcion[] = [ // lista de opciones de deportes
    { nombre: NOMBRE_DEPORTES[DEPORTES.basket], valor: DEPORTES.basket },
    { nombre: NOMBRE_DEPORTES[DEPORTES.futbol], valor: DEPORTES.futbol },
];

const generos: iOpcion[] = [ // lista de opciones de generos
    { nombre: NOMBRE_GENEROS[GENEROS.femenino], valor: GENEROS.femenino },
    { nombre: NOMBRE_GENEROS[GENEROS.masculino], valor: GENEROS.masculino },
];

const categoria: iOpcion[] = [ // lista de opciones de categorias
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.primeraFemenina], valor: CATEGORIAS.primeraFemenina },
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.primeraMasculina], valor: CATEGORIAS.primeraMasculina },
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.quinta], valor: CATEGORIAS.quinta },
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.septima], valor: CATEGORIAS.septima },
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.novena], valor: CATEGORIAS.novena },
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.undecima], valor: CATEGORIAS.undecima },
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.decimoTercera], valor: CATEGORIAS.decimoTercera },
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.decimoQuinta], valor: CATEGORIAS.decimoQuinta },
];

const categoriaF: iOpcion[] = [ // lista de opciones de categorias
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.primeraFemenina], valor: CATEGORIAS.primeraFemenina },
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.novena], valor: CATEGORIAS.novena },
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.undecima], valor: CATEGORIAS.undecima },
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.decimoTercera], valor: CATEGORIAS.decimoTercera },
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.decimoQuinta], valor: CATEGORIAS.decimoQuinta },
];

const categoriaM: iOpcion[] = [ // lista de opciones de categorias
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.primeraMasculina], valor: CATEGORIAS.primeraMasculina },
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.quinta], valor: CATEGORIAS.quinta },
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.septima], valor: CATEGORIAS.septima },
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.novena], valor: CATEGORIAS.novena },
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.undecima], valor: CATEGORIAS.undecima },
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.decimoTercera], valor: CATEGORIAS.decimoTercera },
    { nombre: NOMBRE_CAT_FUTBOL[CATEGORIAS.decimoQuinta], valor: CATEGORIAS.decimoQuinta },
];

const jugadorPorDefecto: iJugador = {              /* valores por defecto para inicializar vista */
    '_id': '0',
    nombre: ' ',
    dni: '0',
    categoria: 0,
    deportes: [],
    telResponsable: '0',
    fechaNacimiento: '2013-09-19T17:00:00.000',
    _attachments: {},
    genero: 0
};

class Jugador extends React.Component<tipoProps> {

    state: iState;

    constructor(props: tipoProps) {

        super(props);
        this.state = {

            jugador: jugadorPorDefecto,
            jugadorTemp: jugadorPorDefecto,
            isReadOnly: true,
            mostrarAlerta: false,
            tipoTelefono: TIPO_MOVIL,
            toastParams: {
                mostrar: false,
                esError: false,
                volverCuandoCancela: false,
                mensaje: ""
            }
        }
    }

    componentDidMount = () => {

        BD.getJugadoresDB().get(this.props.match.params.dni)
            .then((doc) => {
                const docToJugador = (doc: any): iJugador => doc;
                this.setState({
                    jugador: doc,
                    jugadorTemp: doc,
                    tipoTelefono: (docToJugador(doc).telResponsable.indexOf(PREFIJO_MOVIL) > -1) ? TIPO_MOVIL : TIPO_FIJO
                })
            })
            .catch(() => {
                this.setState({
                    toastParams: {
                        mostrar: true,
                        esError: true,
                        volverCuandoCancela: true,
                        mensaje: "No se pudo cargar el perfil del jugador."
                    }
                })
            });
    }

    renderDeportes = (): string => {

        let respuesta = '';
        const deportes = this.state.jugador.deportes;

        for (let i = 0; i < (deportes.length - 1); i++)
            respuesta = respuesta + NOMBRE_DEPORTES[deportes[i]] + ', ';

        respuesta += NOMBRE_DEPORTES[deportes[deportes.length - 1]]; /* ultimo deporte no lleva coma al final */

        return respuesta;
    }

    renderCategoria = () => {

        let respuesta = null;

        if (this.state.isReadOnly && this.state.jugador.deportes.includes(DEPORTES.futbol))  //si es solo lectura y el deporte es futbola (basket no tiene categoria)
            respuesta = (
                <IonItem>
                    <IonLabel>Categoría Fútbol</IonLabel>
                    <h4>{NOMBRE_CAT_FUTBOL[this.state.jugador.categoria]}</h4>
                </IonItem>
            );
        else
            if (!this.state.isReadOnly && this.state.jugadorTemp.deportes.includes(DEPORTES.futbol)) //esta en modo edicion, por lo que se puede cambiar la categoria
                if (this.state.jugadorTemp.genero === GENEROS.masculino) {
                    respuesta = (
                        <IonItem>
                            <IonLabel>Categoría Fútbol</IonLabel>
                            <IonSelect
                                interface='popover'
                                cancelText="Cancelar"
                                value={this.state.jugadorTemp.categoria}
                                onIonChange={this.guardarCategoria}
                            >
                                {this.renderOpciones(categoriaM)}
                            </IonSelect>

                        </IonItem>
                    );
                }
                else if (this.state.jugadorTemp.genero === GENEROS.femenino) {
                    respuesta = (
                        <IonItem>
                            <IonLabel>Categoría Fútbol</IonLabel>
                            <IonSelect
                                interface='popover'
                                cancelText="Cancelar"
                                value={this.state.jugadorTemp.categoria}
                                onIonChange={this.guardarCategoria}
                            >
                                {this.renderOpciones(categoriaF)}
                            </IonSelect>

                        </IonItem>
                    );
                }
                else {
                    respuesta = (
                        <IonItem>
                            <IonLabel>Categoría Fútbol</IonLabel>
                            <IonSelect
                                interface='popover'
                                cancelText="Cancelar"
                                value={this.state.jugadorTemp.categoria}
                                onIonChange={this.guardarCategoria}
                            >
                                {this.renderOpciones(categoria)}
                            </IonSelect>

                        </IonItem>
                    );
                }

        return respuesta;
    }

    guardarNuevoNombre = (event: any) => {

        this.setState((prevState: iState) => ({
            jugadorTemp: {
                ...prevState.jugadorTemp,
                nombre: event.target.value
            }
        }));
    }

    guardarNuevoTelefono = (telefono: string) => {

        this.setState((prevState: iState) => ({
            jugadorTemp: {
                ...prevState.jugadorTemp,
                telResponsable: telefono
            }
        }));
    }

    guardarFechaNacimiento = (event: any) => {

        this.setState((prevState: iState) => ({
            jugadorTemp: {
                ...prevState.jugadorTemp,
                fechaNacimiento: event.target.value.split('T')[0]
            }
        }));
    }

    guardarCategoria = (event: any) => {  //Se agrega el cambio al jugador temporal antes de aplicarlo al original
        this.setState((prevState: iState) => ({
            jugadorTemp: {
                ...prevState.jugadorTemp,
                categoria: event.target.value
            }
        }));
    }


    guardarDeportes = (event: any) => {

        this.setState((prevState: iState) => ({
            jugadorTemp: {
                ...prevState.jugadorTemp,
                deportes: event.target.value,
                categoria: event.target.value.includes(DEPORTES.futbol) ? this.state.jugador.categoria : 0
            }
        }));
    }

    guardarGenero = (event: any) => {

        this.setState((prevState: iState) => ({
            jugadorTemp: {
                ...prevState.jugadorTemp,
                genero: event.target.value
            }
        }));
    }

    eliminarJugador = () => {

        BD.getJugadoresDB().get(this.state.jugador.dni)
            .then((doc) => BD.getJugadoresDB().remove(doc))
            .then(() => {
                this.setState({ toastParams: { mostrar: true, mensaje: "Perfil eliminado." } });
                this.props.history.push('/listado');
            })
            .catch(() => { this.setState({ toastParams: { mostrar: true, esError: true, mensaje: "No se pudo eliminar el perfil del jugador." } }) });
    }

    actualizarJugador = () => {

        const jugador: iJugador = { ...this.state.jugadorTemp };

        if (!jugador.telResponsable)
            this.setState({ toastParams: { mostrar: true, esError: true, mensaje: "El teléfono debe tener al menos un carácter." } });
        else if (jugador.deportes.length < 1)
            this.setState({ toastParams: { mostrar: true, esError: true, mensaje: "Debe seleccionar al menos un deporte." } });
        else if (jugador.categoria === 0 && jugador.deportes.includes(DEPORTES.futbol))
            this.setState({ toastParams: { mostrar: true, esError: true, mensaje: "Debe seleccionar una categoria." } });
        else if (!regNombre.test(jugador.nombre))
            this.setState({ toastParams: { mostrar: true, esError: true, mensaje: "El nombre debe tener al menos un carácter, sólo se permiten letras, y espacios (no contiguos)." } });
        else {  /* Si es movil, debe ir 9 luego de +54 */
                if ((this.state.tipoTelefono.localeCompare(TIPO_MOVIL) === 0) && (jugador.telResponsable.indexOf(PREFIJO_MOVIL) === -1)) {
                        const telefono = Array.from(jugador.telResponsable);
                        telefono.splice(3, 0, '9');
                        jugador.telResponsable = telefono.join('');
                };
                //jugador.categoria = BD.calcularCategoria(jugador); Esto ya no se utiliza ya que la categoria se puede editar, por lo que no deberia ser actualizada automaticamente.
                BD.getJugadoresDB().upsert(jugador._id, () => jugador)
                    .then(() => {
                        this.setState({
                            jugador: jugador,
                            jugadorTemp: jugador,
                            isReadOnly: true,
                            toastParams: {
                                mostrar: true,
                                mensaje: "Perfil actualizado."
                            }
                        });
                    })
                    .catch(() => { this.setState({ toastParams: { mostrar: true, esError: false, mensaje: "No se pudo actualizar el perfil del jugador." } }) });
             }   
    }

    renderOpciones = (opciones: iOpcion[]) => (

        opciones.map((opcion) => (
            <IonSelectOption value={opcion.valor} key={opcion.valor}>{opcion.nombre}</IonSelectOption>
        ))
    )

    render() {
        return (
            <IonPage>
                <IonContent hidden={this.state.jugador.dni === jugadorPorDefecto.dni} className="vistaJugador">
                    <IonToast
                        isOpen={this.state.toastParams.mostrar}
                        onDidDismiss={() => this.setState({ toastParams: { mostrar: false, esError: false, volverCuandoCancela: false } })}
                        message={this.state.toastParams.mensaje}
                        color={(this.state.toastParams.esError) ? "danger" : "success"}
                        duration={(this.state.toastParams.esError) ? 0 : 1000}
                        buttons={(this.state.toastParams.esError) ?
                            [{ text: 'CERRAR', handler: () => { if (this.state.toastParams.volverCuandoCancela) this.props.history.push("/listado") } }]
                            :
                            []
                        }
                    />
                    <IonItem>
                        <IonLabel>Nombre</IonLabel>
                        <IonInput
                            type="text" value={(this.state.isReadOnly) ? this.state.jugador.nombre : this.state.jugadorTemp.nombre}
                            readonly={this.state.isReadOnly}
                            clearInput={true}
                            minlength={1}
                            inputMode="text"
                            onIonInput={this.guardarNuevoNombre}
                            id="inputNombre"
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel>DNI</IonLabel>
                        <h4>{this.state.jugador.dni}</h4>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Fecha de Nacimiento</IonLabel>
                        <IonDatetime
                            displayFormat="DD/MM/YYYY"
                            pickerFormat="DD/MMM/YYYY"
                            monthShortNames={['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']}
                            max={new Date().toISOString().split('T')[0]}
                            value={(this.state.isReadOnly) ? this.state.jugador.fechaNacimiento : this.state.jugadorTemp.fechaNacimiento}
                            readonly={this.state.isReadOnly}
                            cancelText="Cancelar"
                            doneText="OK"
                            onIonChange={this.guardarFechaNacimiento}
                        />
                    </IonItem>
                    {
                        (this.state.isReadOnly) ?
                                <IonItem>
                                    <IonLabel>Género</IonLabel>
                                    <h4>{NOMBRE_GENEROS[this.state.jugador.genero]}</h4>
                                </IonItem>
                            :
                                <IonItem>
                                    <IonLabel>Género</IonLabel>
                                    <IonSelect
                                        interface='popover'
                                        cancelText="Cancelar"
                                        value={this.state.jugadorTemp.genero}
                                        onIonChange={this.guardarGenero}
                                    >
                                    {this.renderOpciones(generos)}
                                    </IonSelect>
                                </IonItem>
                    }
                    {
                        (this.state.isReadOnly) ?
                            <IonItem>
                                <IonLabel>{(this.state.jugador.deportes.length === 1) ? 'Deporte' : 'Deportes'}</IonLabel>
                                <h4>{this.renderDeportes()}</h4>
                            </IonItem>
                            :
                            <IonItem>
                                <IonLabel>Deportes</IonLabel>
                                <IonSelect multiple={true} cancelText="Cancelar" onIonChange={this.guardarDeportes}>
                                    {this.renderOpciones(deportes)}
                                </IonSelect>
                            </IonItem>
                    }
                    {this.renderCategoria()}
                    <IonItem>
                        <IonLabel>Teléfono del Responsable</IonLabel>
                        <IonButton
                            hidden={!this.state.isReadOnly}
                            size="default"
                            color="success"
                            fill="outline"
                            href={`tel:${this.state.jugador.telResponsable}`}
                        >
                            <IonIcon icon={call} />
                        </IonButton>
                        <IonSelect
                            hidden={this.state.isReadOnly}
                            interface='popover'
                            cancelText="Cancelar"
                            placeholder='Tipo'
                            value={this.state.tipoTelefono}
                            onIonChange={(event: any) => { this.setState({tipoTelefono: event.target.value }) }}
                        >
                            <IonSelectOption value={TIPO_FIJO} key={TIPO_FIJO} >Fijo</IonSelectOption>
                            <IonSelectOption value={TIPO_MOVIL} key={TIPO_MOVIL}>Móvil</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        {
                            (this.state.isReadOnly) ?
                                <h4>{this.state.jugador.telResponsable}</h4>
                            :
                                <PhoneInput
                                    defaultCountry="AR"
                                    countries={["AR"]}
                                    placeholder="ej. 223 5555555"
                                    value={this.state.jugadorTemp.telResponsable}
                                    onChange={this.guardarNuevoTelefono}
                                />
                        }
                    </IonItem>
                    <IonGrid hidden={this.state.jugador._id.localeCompare(jugadorPorDefecto._id) === 0}>
                        <IonRow hidden={!this.state.isReadOnly}>
                            <IonCol size='6'>
                                <IonButton routerLink={`/listado/jugador/${this.props.match.params.dni}/planillaMedica`} className="botonJugador" fill="outline">Planilla Médica</IonButton>
                            </IonCol>
                            <IonCol size='6'>
                                <IonButton
                                    className="botonJugador"
                                    fill="outline"
                                    routerLink={`/listado/jugador/${this.props.match.params.dni}/pagosJugador`}
                                >Pagos</IonButton>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size='6'>
                                {
                                    (this.state.isReadOnly) ?
                                        <IonButton
                                            className="botonJugador"
                                            fill="outline"
                                            onClick={() => this.setState({ isReadOnly: false })}
                                        >Editar</IonButton>
                                        :
                                        <IonButton
                                            className="botonJugador"
                                            fill="outline"
                                            onClick={this.actualizarJugador}
                                        >Guardar</IonButton>
                                }
                            </IonCol>
                            <IonCol hidden={this.state.isReadOnly} size='6'>
                                <IonButton
                                    className="botonJugador"
                                    fill="outline"
                                    onClick={() => {
                                        this.setState({
                                            jugadorTemp: this.state.jugador,
                                            tipoTelefono: (this.state.jugador.telResponsable.indexOf(PREFIJO_MOVIL) > -1)? TIPO_MOVIL: TIPO_FIJO,
                                            isReadOnly: true
                                        })
                                    }}
                                >Cancelar</IonButton>
                            </IonCol>
                            <IonCol hidden={!this.state.isReadOnly} size='6'>
                                <IonButton className="botonJugador" fill="outline" color="danger" onClick={() => { this.setState({ mostrarAlerta: true }) }}>
                                    Eliminar
                                </IonButton>
                                <IonAlert
                                    isOpen={this.state.mostrarAlerta}
                                    onDidDismiss={() => { this.setState({ mostrarAlerta: false }) }}
                                    header='¿Realmente querés eliminar este jugador?'
                                    subHeader='Esta acción no puede deshacerse.'
                                    buttons={[{ text: 'Cancelar' }, { text: 'Eliminar', handler: this.eliminarJugador }]}
                                />
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonPage>
        );
    }
}

export default Jugador;

/*
 
 ver como se modifica la categoria al cambiar el nacimiento y el genero

 */