import React from 'react';
import { Route } from 'react-router-dom';
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { checkbox, logoUsd, people } from 'ionicons/icons';

/* vistas de la app */

import Home from './pages/home';
import Cobros from './pages/cobros';
import Asistencia from './pages/asistencia';
import Emergencia from './pages/emergencia';
import Listado from './pages/listado';
import Jugador from './pages/jugador';
import Configuracion from './pages/configuracion';
import logIn from './pages/logIn';
import OpcionesAdmin from './pages/opcionesAdmin';
import UsuariosExistentes from './pages/usuariosExistentes';
import UsuariosNuevos from './pages/usuariosNuevos';
import About from './pages/about';
import Historial from './pages/historialBalances';
import AsistenciaCatTomar from './pages/asistenciaCategoriaT';
import AsistenciaCatVer from './pages/asistenciaCategoriaV';
import AsistenciaList from './pages/asistenciaListado';
import AsistenciaHist from './pages/asistenciaHistorial';
import PagosJugador from './pages/pagosJugador';
import RegistrarJugador from './pages/registrarJugador';
import PlanillaMedica from './pages/planillaMedica';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import SideMenu from './components/SideMenu';

const App: React.FC = () => (

        <IonApp>
            <IonReactRouter>
            {((window.location.pathname !== "/logIn") && (window.location.pathname !== "/")) && <SideMenu />}
            <IonHeader id={((window.location.pathname === "/logIn") || (window.location.pathname === "/")) ? 'esconder' : ''}>
                    <IonToolbar> Club Dos de Zapayo
                        <IonButtons slot="start">
                            <IonMenuButton autoHide={false}></IonMenuButton>
                        </IonButtons>
                    </IonToolbar>
            </IonHeader>
                <IonTabs>
                    <IonRouterOutlet id="main">
                        <Route path="/cobros" component={Cobros} exact={true} />
                        <Route path="/Asistencia" component={Asistencia} exact={true} />
                        <Route path="/home" component={Home} exact={true} />
                        <Route path="/" component={logIn} exact={true} />
                        <Route path="/emergencia" component={Emergencia} exact={true} />
                        <Route path="/listado" component={Listado} exact={true} />
                        <Route path="/listado/jugador/:dni" component={Jugador} />
                        <Route path="/listado/jugador/:dni/planillaMedica" component={PlanillaMedica} />
                        <Route path="/configuracion/:dniUser" component={Configuracion} />
                        <Route path="/logIn" component={logIn} exact={true} />
                        <Route path="/opcionesAdmin" component={OpcionesAdmin} exact={true} />
                        <Route path="/about" component={About} exact={true} />
                        <Route path="/cobros/historial" component={Historial} exact={true} />
                        <Route path="/asistenciaCatTomar" component={AsistenciaCatTomar} exact={true} />
                        <Route path="/asistenciaCatVer" component={AsistenciaCatVer} exact={true} />
                        <Route path="/asistenciaList/:id" component={AsistenciaList} />
                        <Route path="/asistenciaHist/:id" component={AsistenciaHist} />
                        <Route path="/listado/jugador/:dni/pagosJugador" component={PagosJugador} />
                        <Route path="/usuariosExistentes" component={UsuariosExistentes} exact={true} />
                        <Route path="/usuariosNuevos" component={UsuariosNuevos} exact={true} />
                        <Route path="/listado/registrarJugador" component={RegistrarJugador} exact={true} />
                </IonRouterOutlet>
                    <IonTabBar slot="bottom">
                        <IonTabButton tab="jugadores" layout={((window.location.pathname === "/logIn") || (window.location.pathname === "/")) ? "icon-hide" : "icon-top"} disabled={((window.location.pathname === "/logIn") || (window.location.pathname === "/"))} href="/listado" selected={(window.location.pathname.lastIndexOf("/listado") > -1)}>
                            <IonIcon icon={people} />
                            <IonLabel id={((window.location.pathname === "/logIn") || (window.location.pathname === "/")) ? 'esconder' : ''}>Jugadores</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="Cobros" layout={((window.location.pathname === "/logIn") || (window.location.pathname === "/")) ? "icon-hide" : "icon-top"} disabled={((window.location.pathname === "/logIn") || (window.location.pathname === "/"))} href="/cobros" selected={(window.location.pathname.lastIndexOf("/cobros") > -1) || (window.location.pathname.lastIndexOf("/historial") > -1)}>
                            <IonIcon icon={logoUsd} />
                            <IonLabel id={((window.location.pathname === "/logIn") || (window.location.pathname === "/")) ? 'esconder' : ''}>Cobros</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="Asistencia" layout={((window.location.pathname === "/logIn") || (window.location.pathname === "/")) ? "icon-hide" : "icon-top"} disabled={((window.location.pathname === "/logIn") || (window.location.pathname === "/"))} href="/asistencia" selected={(window.location.pathname.lastIndexOf("/asistencia") > -1)}>
                            <IonIcon icon={checkbox} />
                            <IonLabel id={((window.location.pathname === "/logIn") || (window.location.pathname === "/")) ? 'esconder' : ''}>Asistencia</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            </IonReactRouter>
        </IonApp>
);

export default App;