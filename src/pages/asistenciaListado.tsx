import React, { useState, useEffect } from 'react';
import { IonHeader, IonContent, IonLabel, IonPage, IonItem, IonCheckbox, IonList, IonButton, IonToast, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { RouteComponentProps, useHistory } from 'react-router';
import { iJugador, iAsistItem, iAsistencia, NOMBRE_CAT_FUTBOL } from '../interfaces';
import BD from '../BD';
import PouchDB from 'pouchdb';
import Find from 'pouchdb-find'
import { arrowBack } from 'ionicons/icons';
PouchDB.plugin(Find)

let categoriaDB!: PouchDB.Database<{}>; 

interface UserDetailPageProps extends RouteComponentProps<{
    id: string;
}> { }

const AsistenciaList: React.FC<UserDetailPageProps> = ({ match }) => {

    const [jugadores, setJugadores] = useState<iJugador[]>([]);
    const [presentes, setPresentes] = useState<iAsistItem[]>([]);
    const [toast, setToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastColor, setColor] = useState('');
    const [isDisabled, setDisabled] = useState(true);
    const cat = match.params.id;
    let history = useHistory();

    let titulo = "";

    switch (cat) {
        case "1": categoriaDB = BD.getCat1fDB()
            titulo = NOMBRE_CAT_FUTBOL[1]
            break;
        case "2": categoriaDB = BD.getCat1mDB();
            titulo = NOMBRE_CAT_FUTBOL[2]
            break;
        case "3": categoriaDB = BD.getCat5DB();
            titulo = NOMBRE_CAT_FUTBOL[3]
            break;
        case "4": categoriaDB = BD.getCat7DB();
            titulo = NOMBRE_CAT_FUTBOL[4]
            break;
        case "5": categoriaDB = BD.getCat9DB();
            titulo = NOMBRE_CAT_FUTBOL[5]
            break;
        case "6": categoriaDB = BD.getCat11DB();
            titulo = NOMBRE_CAT_FUTBOL[6]
            break;
        case "7": categoriaDB = BD.getCat13DB();
            titulo = NOMBRE_CAT_FUTBOL[7]
            break;
        case "8": categoriaDB = BD.getCat15DB();
            titulo = NOMBRE_CAT_FUTBOL[8]
            break;
    }

    useEffect(() => {
        const docToJugador = (doc: any): iJugador => doc;
        let jugadoresBuscados: iJugador[] = [];

        setPresentes([]);
        setDisabled(true);
        BD.getJugadoresDB().find({
                selector: {
                    categoria: +cat
                }
        }).then((resultado) => {
            jugadoresBuscados = resultado.docs.map(row => docToJugador(row));
            setJugadores(jugadoresBuscados);
            setDisabled(true);
        })
            .catch(res => { setToast(true) });
        
    }, [cat]);

    const renderJugadores = () => {
        return (
            jugadores.map((jugador: iJugador) => (
                <IonItem key={jugador.dni}>
                    <IonLabel>
                        <h2>{jugador.nombre}</h2>    
                    </IonLabel>
                    <IonCheckbox
                        value = {jugador.dni}
                        onClick = {handleCheck}
                        slot = "end"
                    >
                    </IonCheckbox>
                </IonItem>
            ))
        );
    }

    function handleCheck(event: any) {
        const buscado: iJugador[] = jugadores.filter(obj => obj.dni === event.target.value);
        const existente: iAsistItem[] = presentes.filter(obj => obj.dni === event.target.value);
        let clon = Array.from(presentes);
        if (existente.length === 0) {
            clon.push({ nombre: buscado[0].nombre, dni: buscado[0].dni });
        }
        else {
            clon = clon.filter(function (jug) { return jug.dni !== buscado[0].dni })
        }
        setPresentes(clon);
        setDisabled(clon.length === 0);
    }

    function subirPresentes(event: any) {
        let aPostear: iAsistencia = { '_id': '', presentes: [] };
        const fecha = new Date();
        fecha.setHours(fecha.getHours() - 3);
        aPostear._id = fecha.toISOString().split('T')[0];
        aPostear.presentes = presentes;
        categoriaDB.post(aPostear)
            .then(res => {
                setToastMsg("Presentes cargados con éxito");
                setColor("success");
                setToast(true);
                setPresentes([]);
                setDisabled(true);
            })
            .catch(res => {
                setToastMsg("ERROR: presentes no fueron cargados");
                setColor("danger");
                setToast(true);
                setPresentes([]);
                setDisabled(true);
            })
   
    }

    return (
        <IonPage>
            <IonToast
                isOpen={toast}
                onDidDismiss={() => setToast(false)}
                color={toastColor}
                message={toastMsg}
                duration={3500}
            />
            <IonContent>
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton
                        size="small"
                        onClick={() => { history.push(`/asistenciaCatTomar`) }}
                >
                        <IonIcon icon={arrowBack} />
                    </IonFabButton>
                </IonFab>
                <IonHeader>
                    <IonItem>
                        {titulo}
                        <IonButton disabled={isDisabled} slot="end" size="small" onClick={subirPresentes}>Confirmar asistencia</IonButton>
                    </IonItem>
                </IonHeader>
                <IonList>
                    {renderJugadores()}
                </IonList>
            </IonContent>
        </IonPage>
    );

};
export default AsistenciaList;