import React, { FormEvent } from 'react';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonItemGroup, IonButton, IonIcon, IonText, IonRow, IonCol, IonGrid, IonToast } from '@ionic/react';
import { checkmarkCircle } from 'ionicons/icons';
import { iPago, iProfesor, iBalance, iJugador } from '../interfaces';
import BD from '../BD';
import { FileOpener } from '@ionic-native/file-opener';
import { isPlatform } from '@ionic/react';
import { File } from '@ionic-native/file';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

/* valores por defecto para inicializar vista */
const usuarioPorDefecto: iProfesor = {
    _id: "0",
    nombre: " ",
    dni: "0",
    email: " ",
    pass: " "
}

const pagoPorDefecto: iPago = {
    _id: "0",
    fecha: "",
    dniProfesor: "0",
    monto: 0,
    dniJugador: "0",
    nombreProfesor: ""
}

const balancePorDefecto: iBalance = {
    _id: "0",
    fechaCancelacion: "",
    total: -1,
    nombreProfesor: ""
}

interface iState {
    ocultarBotonComprobante: boolean,
    toastParams: {
        mostrar: boolean,
        mensaje: string,
        esError: boolean,
    },
    pagoActual: iPago,
    balance: iBalance,
    nombreJugador: string,
    usuarioActual: iProfesor,
}

class Cobros extends React.Component {

    state: iState;

    constructor(props: Readonly<{}>) {

        super(props);
        this.state = {
            ocultarBotonComprobante: true,
            toastParams: {
                mostrar: false,
                mensaje: "",
                esError: false
            },
            pagoActual: pagoPorDefecto,
            balance: balancePorDefecto,
            nombreJugador: "",
            usuarioActual: usuarioPorDefecto
        };
    }

    componentDidMount = async () => {

        try {
            const respuesta = await BD.getProfesoresDB().getSession();
            if (respuesta.userCtx.name) {
                const usuarioActual: any = await BD.getProfesoresDB().getUser(respuesta.userCtx.name);
                const balanceActual = await BD.getBalancesDB().get(usuarioActual.dni);
                this.setState({ balance: balanceActual, usuarioActual: usuarioActual })
            }
            else
                this.setState({
                    toastParams: {
                        mostrar: true,
                        mensaje: "No se pudo descargar el usuario actual.",
                        esError: true
                    }
                })
        }
        catch (error) {
            this.setState({
                toastParams: {
                    mostrar: true,
                    mensaje: "No se pudo descargar el usuario o balance actual.",
                    esError: true
                }
            })
        }
    }

    registrarPago = async (event: FormEvent) => {

        event.preventDefault();

        const data = new FormData(event.target as HTMLFormElement);
        const dni = String(data.get("dni"));
        const monto = parseFloat(String(data.get("monto")));

        if (dni.length === 0)
            this.setState({ toastParams: { mostrar: true, mensaje: "DNI no registrado.", esError: true } });
        else if (!monto)
            this.setState({ toastParams: { mostrar: true, mensaje: "Ingresá un monto mayor a cero.", esError: true } });
        else
            try {
                const jugador: iJugador = await BD.getJugadoresDB().get(dni); /* busca dni en DB */

                const fechaActual = new Date();
                fechaActual.setHours(fechaActual.getHours() - 3)
                const fechaString = fechaActual.toISOString();

                const pago: iPago = {
                    _id: dni + "_" + fechaString.split('T')[0] + "_" + this.state.usuarioActual.dni,
                    fecha: fechaString,
                    dniProfesor: this.state.usuarioActual.dni,
                    monto: monto,
                    dniJugador: dni,
                    nombreProfesor: this.state.usuarioActual.nombre
                };
                await BD.getPagosDB().put(pago);

                const balance: iBalance = {         /* actualizacion del balance */
                    "_id": this.state.balance._id,
                    fechaCancelacion: "",
                    total: this.state.balance.total + monto,
                    nombreProfesor: this.state.balance.nombreProfesor
                }
                await BD.getBalancesDB().upsert(balance._id, () => balance);

                (document.getElementById("dni") as HTMLInputElement).value = "";      /* limpia campos */
                (document.getElementById("monto") as HTMLInputElement).value = "";

                this.setState({
                    ocultarBotonComprobante: false,
                    pagoActual: pago,
                    balance: balance,
                    toastParams: {
                        mostrar: true,
                        mensaje: "Pago registrado exitosamente.",
                        esError: false
                    },
                    nombreJugador: jugador.nombre
                });
            }
            catch (error) {

                let mensaje = "";

                switch (error.status) {
                    case 404: mensaje = "DNI no registrado."; break;
                    case 409: mensaje = "Pago ya registrado el día de hoy"; break;
                    default: mensaje = "Error al intentar registrar el pago.";
                }

                this.setState({
                    toastParams: {
                        mostrar: true,
                        mensaje: mensaje,
                        esError: true
                    }
                });
            }
    }

    generarComprobante = () => {

        const fecha = new Date(this.state.pagoActual.fecha);
        fecha.setHours(fecha.getHours() + 3);

        const docDefinition: any = {
            pageSize: 'A6',
            pageOrientation: 'landscape',
            info: {
                title: `comprobante_${this.state.pagoActual._id}`,
                author: 'Club Social y Deportivo 2 de Mayo',
            },
            content: [
                {
                    columns: [
                        {
                            image: 'data:image/jpeg;base64,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.jpg',
                            width: 100,
                            height: 100
                        },
                        {
                            text: [
                                'Club Social y Deportivo 2 de Mayo',
                                '\n\n\n\nID. Comprobante: ', { text: this.state.pagoActual._id, bold: true },
                            ],
                            style: 'right'
                        }
                    ],
                },
                {
                    text: [
                        '\nMar Del Plata, Argentina', ' - Fecha: ', { text: fecha.toLocaleString('es-AR'), bold: true },
                        '\n\nRecibí de ', { text: this.state.nombreJugador.toUpperCase(), bold: true }, ' - DNI: ',
                        { text: this.state.pagoActual.dniJugador, bold: true },
                        '\nLa suma de $ ', { text: this.state.pagoActual.monto.toLocaleString('es-AR'), bold: true }, ' PESOS. ',
                        '\nEn concepto de ', { text: 'CUOTA DEL CLUB.', bold: true },
                        '\nRecibido por ', { text: this.state.usuarioActual.nombre.toUpperCase(), bold: true },
                        ' - DNI: ', { text: this.state.usuarioActual.dni, bold: true },
                    ],
                    style: 'parrafo'
                }
            ],
            styles: {
                right: {
                    alignment: 'right'
                },
                parrafo: {
                    fontSize: 14,
                    alignment: 'center'
                }
            }
        };

        const grabarPDF = async (buffer: any) => {

            const arregloBinario = new Uint8Array(buffer).buffer;
            const nombreArch = `${docDefinition.info.title}.pdf`;

            if (File.externalApplicationStorageDirectory) /* podria no estar montado el directorio externo */
                try {
                    const fileEntry = await File.createFile(File.externalApplicationStorageDirectory, nombreArch, true);
                    fileEntry.createWriter((fileWriter) => {
                        fileWriter.onwriteend = () => {
                            FileOpener.open(File.externalApplicationStorageDirectory + nombreArch, 'application/pdf')
                                .then(() => { this.setState({ ocultarBotonComprobante: true }); })
                                .catch(() => {
                                    this.setState({
                                        toastParams: {
                                            mostrar: true,
                                            mensaje: 'No se pudo abrir el comprobante.',
                                            esError: true
                                        }
                                    });
                                });
                        };
                        fileWriter.onerror = () => {
                            this.setState({
                                toastParams: {
                                    mostrar: true,
                                    mensaje: 'No se pudo generar el comprobante.',
                                    esError: true
                                }
                            });
                        };
                        fileWriter.write(arregloBinario);
                    });
                }
                catch (error) {
                    this.setState({
                        toastParams: {
                            mostrar: true,
                            mensaje: 'No se pudo generar el archivo.',
                            esError: true
                        }
                    });
                }
            else
                this.setState({
                    toastParams: {
                        mostrar: true,
                        mensaje: 'No se pudo generar el archivo.',
                        esError: true
                    }
                });
        }

        if (isPlatform('cordova') || isPlatform('capacitor'))
            pdfMake.createPdf(docDefinition).getBuffer(grabarPDF) /* ANDROID */
        else {
            pdfMake.createPdf(docDefinition).download(`${docDefinition.info.title}.pdf`); /* VERSION WEB */
            this.setState({ ocultarBotonComprobante: true });
        }
    }

    cancelarBalance = async () => {

        if (this.state.balance.total > 0) {

            const fechaActual = new Date();
            fechaActual.setHours(fechaActual.getHours() - 3)

            let balance: iBalance = {
                "_id": this.state.balance._id + "/" + fechaActual.toISOString().split('T')[0],
                nombreProfesor: this.state.balance.nombreProfesor,
                fechaCancelacion: fechaActual.toISOString(),
                total: this.state.balance.total
            }

            try {

                await BD.getHistorialBalancesDB().put(balance);

                balance._id = this.state.balance._id;
                balance.nombreProfesor = this.state.balance.nombreProfesor;
                balance.fechaCancelacion = "";
                balance.total = 0;

                await BD.getBalancesDB().upsert(balance._id, () => balance);

                this.setState({
                    toastParams: {
                        mostrar: true,
                        mensaje: "Balance cancelado.",
                        esError: false
                    },
                    balance: balance
                })

            }
            catch (error) {

                let mensaje = (error.status === 409) ? "Balance ya cancelado el día de hoy" : "No se pudo cancelar el balance actual.";

                this.setState({
                    toastParams: {
                        mostrar: true,
                        mensaje: mensaje,
                        esError: true
                    }
                })
            }
        }
        else
            this.setState({
                toastParams: {
                    mostrar: true,
                    mensaje: "El balance ya es nulo.",
                    esError: true
                }
            })
    }

    render() {

        return (
            <IonPage>
                <IonContent hidden={this.state.balance._id === balancePorDefecto._id} class="Cobro">
                    <IonToast
                        isOpen={this.state.toastParams.mostrar}
                        onDidDismiss={() => this.setState({ toastParams: { mostrar: false, esError: false } })}
                        message={this.state.toastParams.mensaje}
                        color={(this.state.toastParams.esError) ? "danger" : "success"}
                        showCloseButton={this.state.toastParams.esError}
                        duration={(this.state.toastParams.esError) ? 0 : 1000}
                        closeButtonText="CERRAR"
                    />
                    <form onSubmit={this.registrarPago}>
                        <IonItem>
                            <IonLabel>Cobros</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonInput id="dni" name="dni" placeholder="DNI Jugador/a" inputMode="text" type="text"></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonInput id="monto" name="monto" placeholder="Monto" inputMode="decimal" step="0.01" type="number" min="0.01" ></IonInput>
                        </IonItem>
                        <IonGrid>
                            <IonRow align-content-center>
                                <IonCol>
                                    <IonButton type="submit" fill="outline" color="success">Registrar Pago</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </form>
                    <IonGrid hidden={this.state.ocultarBotonComprobante}>
                        <IonRow align-content-center>
                            <IonCol>
                                <IonButton fill="outline" onClick={this.generarComprobante}>Generar Comprobante</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <IonItemGroup>
                        <IonItem>
                            <IonLabel>Balance</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonText>
                                <h4>{'$' + this.state.balance.total.toLocaleString('es-AR')}</h4>
                            </IonText>
                            <IonButton fill="outline" slot="end" size="default" color="success" onClick={this.cancelarBalance}>
                                <IonIcon icon={checkmarkCircle} />
                            </IonButton>
                        </IonItem>
                        <IonGrid>
                            <IonRow align-content-center>
                                <IonCol>
                                    <IonButton fill="outline" routerLink="/cobros/historial">
                                        Historial de Balances
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItemGroup>
                </IonContent>
            </IonPage>
        );
    }
};

export default Cobros;