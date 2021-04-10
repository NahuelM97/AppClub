import React, { useState, useEffect } from 'react';
import { IonPage, IonItem, IonLabel, IonContent, IonList, IonButton, IonRadio, IonListHeader, IonRadioGroup, IonToast, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router';
import '../theme/usuarios.css';
import { iProfesor, iBalance, TEACHER_NAME } from '../interfaces';
import BD from '../BD';
import { arrowBack } from 'ionicons/icons';

const base64 = require('base-64');
const utf8 = require('utf8');

const balance: iBalance = {
    '_id': '',
    fechaCancelacion: '',
    nombreProfesor: '',
    total: 0,

}

const UsuariosNuevos: React.FC = () => {

    const [usuarios, setUsuarios] = useState<iProfesor[]>([]);
    const [selected, setSelected] = useState<string>("");
    const [toast, setToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastColor, setToastColor] = useState('danger');
    let history = useHistory();

    async function actualizarUsuarios() {
        let pendientesRecibidos: iProfesor[] = [];
        const docToProfesor = (doc: any): iProfesor => doc;
        const res = await BD.getPendientesDB().find({ selector: { dni: { $gte: null } }, sort: ['dni'] });
        try {
            pendientesRecibidos = res.docs.map(doc => docToProfesor(doc));
            setUsuarios(pendientesRecibidos);
        }
        catch(err) {
            setToastColor("danger");
            setToastMsg("ERROR al obtener lista de usuarios pendientes");
            setToast(true);
        };
    }

    useEffect(() => {
        actualizarUsuarios();
    }, []);

    function handleSeleccion(event: any) {
        setSelected(event.target.value);
    }

    function handleRechazarPendiente(event: any) {
        if (selected) {
            BD.getPendientesDB().get(selected)
                .then((doc) => {
                    BD.getPendientesDB().remove(doc)
                        .then(res => {
                            setToastColor("success");
                            setToastMsg("Se ha rechazado al usuario pendiente con éxito");
                            setToast(true);
                            actualizarUsuarios();
                        }).catch(res => {
                            setToastColor("danger");
                            setToastMsg("ERROR al rechazar al usuario pendiente");
                            setToast(true);
                        });

            }).catch(function (err: Error) {
                console.log(err);
                setToastColor("danger");
                setToastMsg("ERROR no se encuentra usuario pendiente seleccionado");
                setToast(true);
            });
            setSelected("");
        }
    }

    function handleAceptarPendiente(event: any) {
        if (selected) {
            let aPostear: iProfesor = { '_id': '', nombre: '', dni: '', email: '', pass: '' }
            BD.getPendientesDB().get(selected).then(function (doc: any) {
                aPostear.nombre = doc.nombre;
                aPostear.dni = doc.dni;
                aPostear.email = doc.email;
                aPostear.pass = base64.decode(doc.pass);
                aPostear.pass = utf8.decode(aPostear.pass);
                BD.getProfesoresDB().signUp(aPostear.dni, aPostear.pass, {
                    metadata: {
                        email: aPostear.email,
                        nombre: aPostear.nombre,
                        dni: aPostear.dni,
                    },
                    roles: [
                        TEACHER_NAME
                    ]
                }).then(res => {
                    balance.nombreProfesor = aPostear.nombre;
                    balance._id = aPostear.dni;
                    BD.getBalancesDB().upsert(balance._id, () => balance);
                    BD.getPendientesDB().remove(doc).then(res => {
                        actualizarUsuarios().then(res => {
                            renderUsuariosPendientes();
                        })
                    });
                    setToastColor("success");
                    setToastMsg("Se ha aceptado al usuario pendiente con éxito");
                    setToast(true);
                }).catch(error => {
                    console.log(error);
                    setToastColor("danger");
                    if (error.name === "conflict")
                        setToastMsg("ERROR ya existe un usuario con este DNI.");
                    else
                        setToastMsg("ERROR al aceptar al usuario pendiente.");
                    setToast(true);
                });
            }).catch(function (err: Error) {
                console.log(err);
                setToastColor("danger");
                setToastMsg("ERROR no se encuentra usuario pendiente seleccionado");
                setToast(true);
            });
            setSelected("");
        } 
    }

    const renderUsuariosPendientes = () => {
        return (
            usuarios.map((usuario: iProfesor) => (
                <IonItem key={usuario._id}>
                    <IonLabel>
                        <h2>{usuario.nombre} DNI: {usuario.dni}</h2>
                    </IonLabel>
                        <IonRadio value={usuario._id} onIonSelect={handleSeleccion} />
                </IonItem>
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
                            <IonLabel>Lista de usuarios nuevos</IonLabel>
                        </IonListHeader>
                        {renderUsuariosPendientes()}
                    </IonRadioGroup>
                </IonList>
                <IonLabel class="botonCont">
                    <IonButton onClick={handleAceptarPendiente} color="primary" fill="outline" size="small" slot="end">Aceptar</IonButton>
                    <IonButton onClick={handleRechazarPendiente} color="primary" fill="outline" size="small" slot="end">Rechazar</IonButton>
                </IonLabel>
            </IonContent>
        </IonPage>
    );
};

export default UsuariosNuevos;
/*UTF8*/