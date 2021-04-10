import React, { useState, useEffect } from 'react';
import { IonPage, IonItem, IonLabel, IonContent, IonList, IonListHeader, IonRadioGroup, IonToast, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router';
import '../theme/usuarios.css';
import { iProfesor } from '../interfaces';
import BD from '../BD';
import { Link } from 'react-router-dom';
import { arrowBack } from 'ionicons/icons';

const UsuariosExistentes: React.FC = () => {
    const [usuarios, setUsuarios] = useState<iProfesor[]>([]);
    const [toast, setToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastColor, setToastColor] = useState('danger');
    let history = useHistory();

    function actualizarUsuarios() {
        let usuariosRecibidos: iProfesor[] = [];
        const docToProfesor = (doc: any): iProfesor => doc;

        BD.getUsersDB().find({ selector: { name: { $gte: null } }, sort: ['name'] })
            .then((resultado) => {
                usuariosRecibidos = resultado.docs.map(doc => docToProfesor(doc));
                setUsuarios(usuariosRecibidos);
            })
            .catch(res => {
                setToastColor("danger");
                setToastMsg("ERROR al obtener lista de usuarios");
                setToast(true);
            });
    }

    useEffect(() => {
        actualizarUsuarios();
    }, []);

    const renderUsuarios = () => {
        return (
            usuarios.map((usuario: iProfesor) => (
                <Link to={`/configuracion/${usuario.dni}`} style={{ textDecoration: 'none' }} key={usuario.dni}>
                    <IonItem key={usuario.dni}>
                        <IonLabel>
                            <h2>{usuario.nombre}</h2>
                        </IonLabel>
                    </IonItem>
                </Link>
            )));
    }

    return (
        <IonPage>
            <IonToast
                isOpen={toast}
                onDidDismiss={() => setToast(false)}
                message={toastMsg}
                color={toastColor}
                duration={3500}
            />
            <IonContent>
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton
                        size="small"
                        onClick={() => { history.push('/opcionesAdmin') }}
                    >
                        <IonIcon icon={arrowBack} />
                    </IonFabButton>
                </IonFab>
                <IonRefresher slot="fixed"
                    onIonRefresh={(event) => {
                        actualizarUsuarios();
                        setTimeout(() => { event.detail.complete() }, 500);
                    }}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <IonList>
                    <IonRadioGroup>
                        <IonListHeader>
                            <IonLabel>Lista de usuarios existentes</IonLabel>
                        </IonListHeader>
                        {renderUsuarios()}
                    </IonRadioGroup>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default UsuariosExistentes;
/*UTF8*/