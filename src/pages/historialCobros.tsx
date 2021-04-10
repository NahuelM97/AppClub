import React, { useState, useEffect } from 'react';
import { IonHeader, IonItem, IonList, IonLabel, IonPage, IonContent } from '@ionic/react';
import BD from '../BD';
import { iBalance } from '../interfaces';

const Historial: React.FC = () => {

    const [historiales, setHistoriales] = useState<iBalance[]>([]);

    useEffect(() => {

        const docToBalance = (doc: any): iBalance => doc;
        let balancesBuscados: iBalance[] = [];

        BD.getHistorialBalancesDB().allDocs({ include_docs: true })
            .then((resultado) => {
                balancesBuscados = resultado.rows.map(row => docToBalance(row.doc));
                setHistoriales(balancesBuscados);
            })
            .catch(console.log);
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
            <IonContent>
                <IonHeader>
                    <IonItem>
                        <b> Historial de cobros </b>
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