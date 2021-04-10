import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import logoClub from '../images/logoclub.jpg'
import '../theme/home.css';

const Home: React.FC = () => (

    <IonPage>
        <IonContent id="home">
            <h2 id='titulo'> Aplicación Administrativa <br /> Club 2 de Mayo </h2>
            <img id='logoClub' src={logoClub} alt="Logo del club" />
            <h4 id='fundacion'> Fundado el 18 de Julio de 2008 </h4>
        </IonContent>
    </IonPage>
);

export default Home;