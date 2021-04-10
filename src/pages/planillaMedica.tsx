import React from 'react';
import { IonPage, IonContent, IonSlides, IonFab, IonFabButton, IonIcon, IonButton, IonItem, IonToast, IonAlert, IonModal, IonHeader } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import BD from '../BD';
import { add, trash, arrowBack } from 'ionicons/icons';
import '../theme/planillaMedica.css';
import { MAX_IMG } from '../interfaces';

/*
                                                            LEEME 
    
    Para mostrar las imágenes, se usa IonSlide/IonSlides. Al día 08/02/2020, existe un bug en estos componentes: al generar 
    slides dinámicamente, estas cargan una debajo de otra, fuera del contenedor IonSlides. No es un scroll vertical, pues 
    los eventos que dependen de movimientos, como IonSlideDidChange, se siguen generando al hacer movimentos horizontales.

    Aun así, se puede salvar esta situación, trabajando con el componente en que se basan los slides: Swiper. Así es como está
    escrito el código hasta este momento. Cada vez que se modifica el arreglo de imagenesParaMostrar (al cargar/borrar imágenes 
    por ejemplo), se debe llamar a renderSlides(), por lo general luego de hacer setState() con el nuevo arreglo.

    Existe un Issue abierto en gitHub acerca de este bug, donde hay soluciones temporales presentadas, y donde, posiblemente,
    aparezca en algún momento la solución oficial.

    Link: https://github.com/ionic-team/ionic/issues/18784

 */

interface imagen {
    url: string,
    nombre: string
}

interface iState {
    imagenesParaMostrar: imagen[],
    ocultarFAB: boolean,
    mostrarPopover: boolean,
    imagenesParaSubir: FileList | File[],
    formatoIncorrecto: boolean,
    mostrarAlerta: boolean,
    toastParams: {
        mostrar: boolean,
        mensaje: string,
        esError: boolean,
    }
}

type tipoProps = RouteComponentProps<{ dni: string }>;

class PlanillaMedica extends React.Component<tipoProps> {

    state: iState; 
    swiperRef: React.RefObject<HTMLIonSlidesElement>;

    constructor(props: tipoProps) {

        super(props);
        this.state = {
            imagenesParaMostrar: [],
            ocultarFAB: false,
            mostrarPopover: false,
            imagenesParaSubir: [],
            formatoIncorrecto: false,
            mostrarAlerta: false,
            toastParams: {
                mostrar: false,
                mensaje: "",
                esError: false
            },
        }
        this.swiperRef = React.createRef<HTMLIonSlidesElement>();
    }

    componentDidMount = async () => {

        const imagenesParaMostrar: imagen[] = [];

        try {
            const doc = await BD.getJugadoresDB().get(this.props.match.params.dni);

            for (let nombreImagen in doc._attachments)
                imagenesParaMostrar.push({
                    url: (URL || webkitURL).createObjectURL(
                        await BD.getJugadoresDB().getAttachment(this.props.match.params.dni, nombreImagen)),
                    nombre: nombreImagen
                });

            this.setState({ imagenesParaMostrar: imagenesParaMostrar });
            this.renderSlides(0);
        }
        catch (error) {
            this.setState({
                toastParams: {
                    mostrar: true,
                    mensaje: "No se pudieron descargar las imágenes.",
                    esError: true
                }
            })
        }
    }

    renderSlides = async (slideInicial: number) => {

        try {
            const swiper = await this.swiperRef.current!.getSwiper();

            swiper.removeAllSlides();

            this.state.imagenesParaMostrar.forEach((img: imagen) => { /* div class="swiper-zoom-container" para poder hacer zoom */
                swiper.appendSlide(
                    `<IonSlide class='swiper-slide' key="${img.nombre}"><div class="swiper-zoom-container"><img src="${img.url}" alt="${img.nombre}"/></div></IonSlide>`
                );
            });
            swiper.update();
            swiper.slideTo(slideInicial);
        }
        catch (error) {
            this.setState({
                toastParams: {
                    mostrar: true,
                    mensaje: "No se pudieron cargar las imágenes.",
                    esError: true
                }
            })
        }
    }

    componentDidUpdate = (prevProps: any) => {

        if (prevProps.location.pathname !== this.props.location.pathname) 
            this.state.imagenesParaMostrar.forEach((imagen: imagen) => {
                (URL || webkitURL).revokeObjectURL(imagen.url);
            })
    }

    subirImagenes = async (event: any) => {

        event.preventDefault();
        const imagenesParaMostrar = this.state.imagenesParaMostrar.slice();
        const posicion = imagenesParaMostrar.length;
        const URL = (window.URL || window.webkitURL);

        try {
            const doc = await BD.getJugadoresDB().get(this.props.match.params.dni);

            if (!doc._attachments) /* si no tiene ninguna foto, hay que crear _attachments */
                doc._attachments = {};

            for (let i = 0; i < this.state.imagenesParaSubir.length; i++) {

                let nombre = new Date().toISOString().replace(/:/gi, '-') + '_' + this.state.imagenesParaSubir[i].name; /* evita nombre repetido */
                let url = URL.createObjectURL(this.state.imagenesParaSubir[i]);

                doc._attachments[nombre] = {
                    content_type: this.state.imagenesParaSubir[i].type,
                    data: this.state.imagenesParaSubir[i]
                };

                imagenesParaMostrar.push({
                    url: url,
                    nombre: nombre
                });
            }

            await BD.getJugadoresDB().upsert(doc._id, () => doc);
            (document.getElementById('formImagenes') as HTMLFormElement).reset();
            this.setState({
                imagenesParaMostrar: imagenesParaMostrar,
                imagenesParaSubir: [],
                mostrarPopover: false,
                toastParams: {
                    mostrar: true,
                    mensaje: "Imágenes subidas con éxito.",
                    esError: false
                }
            });
            this.renderSlides(posicion);
        }
        catch (error) {
            this.setState({
                toastParams: {
                    mostrar: true,
                    mensaje: "No se pudieron subir las imágenes.",
                    esError: true
                }
            })
        }
    }

    renderVistaPrevia = () => {

        let respuesta = [];
        const URL = (window.URL || window.webkitURL);

        if (this.state.imagenesParaMostrar.length === MAX_IMG)
            respuesta.push(<IonItem color="light" key='no_img'>{`El máximo de imágenes por jugador es ${MAX_IMG}. Eliminá algunas antes de subir otras.`}</IonItem>);
        else if (this.state.imagenesParaSubir.length + this.state.imagenesParaMostrar.length > MAX_IMG)
                respuesta.push(<IonItem color="danger" key='no_img'>{`El máximo de imágenes por jugador es ${MAX_IMG}. Eliminá algunas antes de subir otras, o elegí menos imágenes.`}</IonItem>);
             else if (!this.state.imagenesParaSubir.length)
                     respuesta.push(<IonItem color="light" key='no_img'>No hay imágenes seleccionadas para subir.</IonItem>);
                  else
                    for (let i = 0; i < this.state.imagenesParaSubir.length; i++) {
                        if (this.state.imagenesParaSubir[i].type.lastIndexOf('image/') > -1) {
                            let url = URL.createObjectURL(this.state.imagenesParaSubir[i]); /* let aca, sino no cambia en cada iteracion */
                            respuesta.push(
                                <IonItem color="light" key={i}>
                                    {this.state.imagenesParaSubir[i].name}
                                    <img
                                        onLoad={() => { URL.revokeObjectURL(url) }}
                                        src={url}
                                        alt={this.state.imagenesParaSubir[i].name}
                                        className="imgVistaPrevia"
                                        slot="end"
                                    />
                                </IonItem>
                            );
                        }
                        else
                            respuesta.push(
                                <IonItem className="itemInvalido" color="danger" key={i}>
                                    {`${this.state.imagenesParaSubir[i].name} tiene un formato no aceptado.`}
                                </IonItem>
                            );
                    }

        return respuesta;
    }

    esconderBotonSubmit = () => {

        let i = 0;

        while ((i < this.state.imagenesParaSubir.length) && (this.state.imagenesParaSubir[i].type.lastIndexOf('image/') > -1))
            i++;

        return ((this.state.imagenesParaSubir.length === 0) || (i !== this.state.imagenesParaSubir.length)
            || (this.state.imagenesParaSubir.length + this.state.imagenesParaMostrar.length > MAX_IMG))
    }

    todosFormatosCorrectos = () => {

        let i = 0;

        while ((i < this.state.imagenesParaSubir.length) && (this.state.imagenesParaSubir[i].type.lastIndexOf('image/') > -1))
            i++;

        return (i === this.state.imagenesParaSubir.length);
    }

    renderModalImagenes = () => (

        <IonModal
            isOpen={this.state.mostrarPopover}
        >
            <IonHeader>
                <IonItem color="light">
                    <IonButton fill="outline"
                        onClick={() => { document.getElementById('inputImagenes')!.click() }}
                    >
                        ELEGIR IMÁGENES
                            </IonButton>
                    <IonButton
                        slot="end"
                        onClick={() => { this.setState({ mostrarPopover: false, imagenesParaSubir: [] }) }}
                        fill="outline"
                    >
                        CERRAR
                            </IonButton>
                    <input
                        type="file"
                        multiple
                        hidden
                        required
                        accept="image/*"
                        id="inputImagenes"
                        onChange={() => {
                            this.setState({
                                imagenesParaSubir: (document.getElementById('inputImagenes') as HTMLInputElement).files
                            })
                        }}
                    />
                </IonItem>
            </IonHeader>
            <IonContent id="vistaPrevia" color="light">
                <form onSubmit={this.subirImagenes} id="formImagenes">
                    {this.renderVistaPrevia()}
                    <IonItem color="light" hidden={this.esconderBotonSubmit()}>
                        <IonButton
                            type="submit"
                            fill="outline"
                            color="success"
                        >
                            Subir
                        </IonButton>
                    </IonItem>
                </form>
            </IonContent>
        </IonModal>
    )

    eliminarFoto = async () => {

        try {
            const doc = await BD.getJugadoresDB().get(this.props.match.params.dni);
            const swiper = await this.swiperRef.current!.getSwiper();
            const slideActual = swiper.activeIndex;

            await BD.getJugadoresDB().removeAttachment(
                doc._id,
                this.state.imagenesParaMostrar[slideActual].nombre,
                doc._rev,
            );

            const imagenes = this.state.imagenesParaMostrar.slice();
            (URL || webkitURL).revokeObjectURL(imagenes[slideActual].url);
            const posicion = (imagenes.length - 1 === slideActual) ? slideActual - 1 : slideActual;
            imagenes.splice(slideActual, 1);

            this.setState({
                imagenesParaMostrar: imagenes,
                ocultarFAB: (imagenes.length !== 0),
                toastParams: {
                    mostrar: true,
                    mensaje: "Imagen eliminada.",
                    esError: false
                }
            });
            this.renderSlides(posicion);
        }
        catch (error) {
            this.setState({
                toastParams: {
                    mostrar: true,
                    mensaje: "No se pudo eliminar la imagen seleccionada.",
                    esError: true
                }
            });
        }
    }

    render() {
        return (
            <IonPage>
                <IonContent>
                    <IonToast
                        isOpen={this.state.toastParams.mostrar}
                        onDidDismiss={() => this.setState({ toastParams: { mostrar: false, esError: false } })}
                        message={this.state.toastParams.mensaje}
                        color={(this.state.toastParams.esError) ? "danger" : "success"}
                        showCloseButton={this.state.toastParams.esError}
                        duration={(this.state.toastParams.esError) ? 0 : 1000}
                        closeButtonText="CERRAR"
                    />
                    <IonSlides
                        onIonSlideTap={() => this.setState({ ocultarFAB: !this.state.ocultarFAB })}
                        ref={this.swiperRef}
                        scrollbar
                    />
                    <IonFab hidden={this.state.ocultarFAB} vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton
                            size="small"
                            onClick={() => { this.props.history.push(`/listado/jugador/${this.props.match.params.dni}`) }}
                        >
                            <IonIcon icon={arrowBack} />
                        </IonFabButton>
                        <IonFabButton size="small" onClick={() => { this.setState({ mostrarPopover: true }) }}>
                            <IonIcon icon={add} />
                        </IonFabButton>
                        <IonFabButton
                            color="danger"
                            size="small"
                            onClick={() => this.setState({ mostrarAlerta: true })}
                            hidden={this.state.imagenesParaMostrar.length === 0}
                        >
                            <IonIcon icon={trash} />
                        </IonFabButton>
                    </IonFab>
                    {this.renderModalImagenes()}
                    <IonAlert
                        isOpen={this.state.mostrarAlerta}
                        onDidDismiss={() => { this.setState({ mostrarAlerta: false }) }}
                        header='¿Realmente querés eliminar esta imagen?'
                        subHeader='Esta acción no puede deshacerse.'
                        buttons={[{ text: 'Cancelar' }, { text: 'Eliminar', handler: this.eliminarFoto }]}
                    />
                </IonContent>
            </IonPage>
        )
    }
}

export default PlanillaMedica;