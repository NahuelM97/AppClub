import React from 'react';
import { IonPage, IonContent, IonItem } from '@ionic/react';
import logoClub from '../images/logoclub.jpg'
import '../theme/about.css';

const About: React.FC = () => {

    return (
        <IonPage id="about-page">
            <IonContent>
                <h2 id='titulo'> Aplicación Administrativa <br /> Club 2 de Mayo </h2>
                <img id='logoClub' src={logoClub} alt="Logo del club" />
                <h4 id='version'> Version 1.0 </h4>
                <div>
                    <IonItem id='about'> Esta aplicación ha sido desarrollada por Ivan Aprea, Martín Casas, Mariquena Gros y Pablo Porzio, como Práctica Profesional
                        Supervisada de la carrera Ingeniería Informática dictada en la Facultad de Ingeniería de la UNMDP. Proyecto a cargo de Natalia Bartels y Felipe Evans.
                    </IonItem>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default About;
/*UTF8*/