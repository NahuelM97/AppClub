import React from 'react';
import { IonPage, IonContent, IonButton, IonText } from '@ionic/react';
import '../theme/jugadores.css';

const OpcionesAdmin: React.FC = () => {
    return (
        <IonPage>
            <IonContent>
                <div id='textoJugadores'>
                    <IonText>Opciones de administrador</IonText>
                </div>
                <IonButton className="botonJugadores" fill="outline" routerLink="/usuariosNuevos">Solicitudes de <br /> nuevos usuarios</IonButton>
                <IonButton className="botonJugadores" fill="outline" routerLink="/usuariosExistentes">Lista de <br /> usuarios existentes</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default OpcionesAdmin;
/*UTF8*/