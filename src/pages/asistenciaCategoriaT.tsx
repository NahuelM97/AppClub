import React from 'react';
import { IonHeader, IonPage, IonButton, IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import '../theme/asistencia.css';

const AsistenciaCatTomar: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol><IonButton id='boton' size="default" fill="outline" routerLink="/asistenciaList/1">1° División <br /> femenina</IonButton></IonCol>
                        <IonCol><IonButton id='boton' size="default" fill="outline" routerLink="/asistenciaList/2">1° División <br /> masculina</IonButton></IonCol>
                    </IonRow>
                </IonGrid>
                <IonGrid>
                    <IonRow>
                        <IonCol><IonButton id='boton' size="default" fill="outline" routerLink="/asistenciaList/3">5° División <br /> masculina</IonButton></IonCol>
                        <IonCol><IonButton id='boton' size="default" fill="outline" routerLink="/asistenciaList/4">7° División <br /> masculina</IonButton></IonCol>
                    </IonRow>
                </IonGrid>
                <IonGrid>
                    <IonRow>
                        <IonCol><IonButton id='boton' size="default" fill="outline" routerLink="/asistenciaList/5">9° División <br /> mixta</IonButton></IonCol>
                        <IonCol><IonButton id='boton' size="default" fill="outline" routerLink="/asistenciaList/6">11° División <br /> mixta</IonButton></IonCol>
                    </IonRow>
                </IonGrid>
                <IonGrid>
                    <IonRow>
                        <IonCol><IonButton id='boton' size="default" fill="outline" routerLink="/asistenciaList/7">13° División <br /> mixta</IonButton></IonCol>
                        <IonCol><IonButton id='boton' size="default" fill="outline" routerLink="/asistenciaList/8">15° División <br /> mixta</IonButton></IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default AsistenciaCatTomar;