import React, { useState, useEffect } from 'react';
import '../theme/jugadores.css';
import { IonHeader, IonItem, IonList, IonLabel, IonPage, IonContent, IonToast, IonIcon, IonFab, IonFabButton } from '@ionic/react';
import { iPago } from '../interfaces';
import { RouteComponentProps, useHistory } from 'react-router';
import { arrowBack } from 'ionicons/icons';
import BD from '../BD';

interface UserDetailPageProps extends RouteComponentProps<{
    dni: string;
}> { }

const PagosJugador: React.FC<UserDetailPageProps> = ({ match }) => {

    const [pagos, setPagos] = useState<iPago[]>([]);
    const [toast, setToast] = useState(false);
    const dniJugador: string = match.params.dni;
    let history = useHistory();

    useEffect(() => {
        const docToPago = (doc: any): iPago => doc;
        
        let pagosBuscados: iPago[] = [];

        BD.getPagosDB().find({
            selector: {
                dniJugador: dniJugador
            }
        }).then((resultado) => {
            pagosBuscados = resultado.docs.map(row => docToPago(row));
            setPagos(pagosBuscados);
        })
            .catch(res => { setToast(true) });
    }, [dniJugador]);

     const renderPagos = () => {
        return (
            pagos.map((pago: iPago) => (
                <IonItem key={pago.fecha}>
                    <IonLabel>
                        {(pago.fecha).split('T')[0]}
                    </IonLabel>
                    <IonLabel>
                        <b>${pago.monto}</b> 
                    </IonLabel>
                    <IonLabel>
                        {pago.nombreProfesor}
                    </IonLabel>
                </IonItem>
            )));
    }

    return (
        <IonPage>
            <IonToast
                isOpen={toast}
                onDidDismiss={() => setToast(false)}
                color={"danger"}
                message={"ERROR al buscar los pagos pedidos"}
                duration={3500}
            />
            <IonContent>
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton
                        size="small"
                        onClick={() => { history.push(`/listado/jugador/${match.params.dni}`)}}
                    >
                        <IonIcon icon={arrowBack} />
                    </IonFabButton>
                </IonFab>
                <IonHeader>
                    <IonItem>
                        <b> Pagos realizados </b>
                    </IonItem>
                </IonHeader>
                <IonList>
                    {renderPagos()}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default PagosJugador;
/*UTF8*/
