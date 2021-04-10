import {
    IonPage,
    IonContent,
    IonText,
    IonButton,
} from '@ionic/react';
import React from 'react';
import '../theme/asistencia.css';

const Asistencia: React.FC = () => {
    return (
        <IonPage>
            <IonContent>
                <div id='textoJugadores'>
                    <IonText>Asistencia</IonText>
                </div>
                <IonButton className="botonJugadores" fill="outline" routerLink="/asistenciaCatTomar">Tomar asistencia</IonButton>
                <IonButton className="botonJugadores" fill="outline" routerLink="/asistenciaCatVer">Historial de <br /> asistencia</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Asistencia;
/*UTF8*/
