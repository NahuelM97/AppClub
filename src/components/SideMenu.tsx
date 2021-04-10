import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonMenuToggle, IonIcon, IonLabel, IonItem, IonText, IonGrid, IonRow, IonCol, IonButton, IonAlert, IonToast } from "@ionic/react";
import { RouteComponentProps, withRouter } from 'react-router';
import { cog, medical, informationCircle, colorWand } from 'ionicons/icons';
import { iProfesor, ADMIN_NAME } from '../interfaces';
import BD from '../BD';

interface iPagina {
    titulo: string;
    ruta: string;
    icono: any;
}

interface iState {
    usuarioActual: iProfesor,
    roles: string[];
    paginas: iPagina[],
    paginasAdmin: iPagina[],
    mostrarAlerta: boolean,
    toastParams: {
        mostrar: boolean,
        mensaje: string,
    }
}

class SideMenu extends React.Component<RouteComponentProps<{}>> {

    paginas: iPagina[] = [
        { titulo: 'Emergencia', ruta: '/emergencia', icono: medical },
        { titulo: 'Configuración', ruta: '/configuracion/', icono: cog },
        { titulo: 'Acerca de esta App', ruta: '/about', icono: informationCircle }
    ];

    paginasAdmin: iPagina[] = [...this.paginas,
        { titulo: 'Opciones de Administrador', ruta: '/opcionesAdmin', icono: colorWand },
    ];

    usuarioPorDefecto: iProfesor = {
        _id: "0",
        nombre: "",
        dni: "0",
        email: "",
        pass: ""
    }

    state: iState = {
        usuarioActual: this.usuarioPorDefecto,
        roles: [],
        paginas: this.paginas,
        paginasAdmin: this.paginasAdmin,
        mostrarAlerta: false,
        toastParams: {
            mostrar: false,
            mensaje: ""
        }
    }

    componentDidMount = async () => {

        try {
            const respuesta = await BD.getProfesoresDB().getSession();
            if (respuesta.userCtx.name) {
                const usuarioActual = await BD.getProfesoresDB().getUser(respuesta.userCtx.name);
                this.setState({ usuarioActual: usuarioActual });
                this.setState({ roles: usuarioActual.roles })
                let i = 0; 
                while (i < this.state.paginas.length) {
                    if (this.state.paginas[i].titulo === 'Configuración') {
                        const arr = this.state.paginas.slice();
                        arr[i].ruta = `/configuracion/${this.state.usuarioActual.dni}`;
                        this.setState({
                            paginas: arr
                        })
                        break;
                    }
                    i++;
                }
            }
        }
        catch (error) {

            if ((this.props.location.pathname.toLowerCase().localeCompare('/login') !== 0) && (error.status === 404))
                this.setState({
                    toastParams: {
                        mostrar: true,
                        mensaje: "No se pudo descargar el usuario actual."
                    }
                });
        }
    }

    renderMenuItems = () => (
        this.state.paginas.map((page: iPagina) => (
            <IonMenuToggle key={page.titulo} auto-hide="false">
                <IonItem button
                    color={(window.location.pathname === page.ruta) ? 'primary' : ''}
                    onClick={() => this.props.history.push(page.ruta)}>
                    <IonIcon slot="start" icon={page.icono}></IonIcon>
                    <IonLabel>{page.titulo}</IonLabel>
                </IonItem>
            </IonMenuToggle>
        ))
    )

    renderMenuAdminItems = () => (
        this.state.paginasAdmin.map((page: iPagina) => (
            <IonMenuToggle key={page.titulo} auto-hide="false">
                <IonItem button
                    color={(window.location.pathname === page.ruta) ? 'primary' : ''}
                    onClick={() => this.props.history.push(page.ruta)}>
                    <IonIcon slot="start" icon={page.icono}></IonIcon>
                    <IonLabel>{page.titulo}</IonLabel>
                </IonItem>
            </IonMenuToggle>
        ))   
    )

    cerrarSesion = async () => {

        try {
            await BD.getProfesoresDB().logOut();
            this.setState({ usuarioActual: this.usuarioPorDefecto });
            window.location.href = '/logIn';
        }
        catch (error) {
            this.setState({
                toastParams: {
                    mostrar: true,
                    mensaje: "No se pudo cerrar la sesión."
                }
            })
        }
    }

    render() {

        return (
            <IonMenu type="overlay" contentId="main" disabled={((window.location.pathname === "/logIn") || (window.location.pathname === "/")) ? true : false}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>
                            Menú
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent class="SideMenu">
                    <IonToast
                        isOpen={this.state.toastParams.mostrar}
                        onDidDismiss={() => this.setState({ toastParams: { mostrar: false } })}
                        message={this.state.toastParams.mensaje}
                        color="danger"
                        showCloseButton={true}
                        closeButtonText="CERRAR"
                    />
                    <IonItem>
                        <IonText>
                            <h4>{this.state.usuarioActual.nombre}</h4>
                        </IonText>
                    </IonItem>
                    <IonList>
                        {(this.state.roles.indexOf(ADMIN_NAME) !== -1) ? this.renderMenuAdminItems() : this.renderMenuItems()}
                    </IonList>
                    <IonGrid>
                        <IonRow align-content-center>
                            <IonCol>
                                <IonButton fill="outline" onClick={() => { this.setState({mostrarAlerta: true}) }}>
                                    Cerrar Sesión
                                </IonButton>
                                <IonAlert
                                    isOpen={this.state.mostrarAlerta}
                                    onDidDismiss={() => { this.setState({ mostrarAlerta: false }) }}
                                    header={'¿Realmente querés cerrar sesión?'}
                                    buttons={['Cancelar', { text: 'Cerrar Sesión', handler: this.cerrarSesion }]}
                                />
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonMenu>
            )
    }
    
}

export default withRouter(
    SideMenu
);