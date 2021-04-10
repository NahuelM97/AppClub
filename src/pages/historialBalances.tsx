import React, { useState, useEffect } from 'react';
import { IonHeader, IonItem, IonList, IonLabel, IonPage, IonContent, IonToast } from '@ionic/react';
import BD from '../BD';
import { iBalance } from '../interfaces';

const Historial: React.FC = () => {

    const [toast, setToast] = useState(false);
    const [historiales, setHistoriales] = useState<iBalance[]>([]);

    useEffect(() => {

        const docToBalance = (doc: any): iBalance => doc;
        let balancesBuscados: iBalance[] = [];

        BD.getHistorialBalancesDB().allDocs({ include_docs: true })
            .then((resultado) => {
                balancesBuscados = resultado.rows.map(row => docToBalance(row.doc));
                setHistoriales(balancesBuscados);
            })
            .catch(res => { setToast(true) });
    }, []);

    const renderBalances = () => {
        return (
            historiales.map((balance: iBalance) => (
                <IonItem key={balance._id}>
                    <IonLabel>
                        {(balance.fechaCancelacion).split('T')[0]}
                    </IonLabel>
                    <IonLabel>
                        <b>${balance.total}</b>
                    </IonLabel>
                    <IonLabel>
                        {balance.nombreProfesor}
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
                message={"ERROR al buscar los historiales de balances pedidos"}
                duration={3500}
            />
            <IonContent>
                <IonHeader>
                    <IonItem>
                        <b> Historial de balances </b>
                    </IonItem>
                </IonHeader>
                <IonList>
                    {renderBalances()}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Historial;
/*UTF8*/