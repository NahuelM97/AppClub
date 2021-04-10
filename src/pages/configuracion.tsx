import React, { useState, FormEvent, useEffect } from 'react';
import { IonHeader, IonPage, IonContent, IonList, IonItem, IonModal, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonLabel, IonInput, IonText, IonToast, IonCheckbox, IonAlert, IonFab, IonFabButton } from '@ionic/react';
import { create, arrowBack } from 'ionicons/icons';
import { regEmail, ADMIN_NAME } from '../interfaces';
import { RouteComponentProps, Redirect, useHistory } from 'react-router';
import '../theme/configuracion.css';
import db from '../BD';

interface UserDetailPageProps extends RouteComponentProps<{
    dniUser: string;
}> { }

const regPass = /^[A-Za-z0-9/*\-,.]+([A-Za-z0-9/*\-,.]+)*$/;

const Configuracion: React.FC<UserDetailPageProps> = ({ match }) => {
    const dniUser = match.params.dniUser;
    const [showModalEmail, setShowModalEmail] = useState(false);
    const [showModalPass, setShowModalPass] = useState(false);
    const [sessionPropia, setSessionPropia] = useState<any>({ name: 0, roles: []});
    useEffect(() => {
        //obtener sesion del profesor pasado por parametro
        db.getProfesoresDB().getSession()
            .then(rta => {
                setSessionPropia(rta.userCtx);
            }).catch(err => {
                setToastColor("danger");
                setToastMsg("Error al obtener datos del profesor");
                setToast(true);
            });
    }, []);
    const [metadata, setMetadata] = useState<any>({});
    const [roles, setRoles] = useState<string[]>([]);
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [differentEmail, setDifferentEmail] = useState(false);
    const [toast, setToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastColor, setToastColor] = useState('danger');
    const [invalidPass, setInvalidPass] = useState(false);
    const [differentPass, setDifferentPass] = useState(false);

    let history = useHistory();

    useEffect(() => {
        //obtener sesion del profesor pasado por parametro
        db.getProfesoresDB().getUser(dniUser)
            .then(rta => {
                setMetadata(rta);
                setRoles(rta.roles!);
                setEmail(metadata.email);
                setIsAdmin((roles.indexOf(ADMIN_NAME)) !== -1);
            }).catch(err => {
                setToastColor("danger");
                setToastMsg("Error al obtener datos del profesor");
                setToast(true);
            });// eslint-disable-next-line
    }, [dniUser, metadata.email ]);

    function handleSubmitEmail(event: FormEvent) {
        event.preventDefault();
        setInvalidEmail(false);
        setDifferentEmail(false);
        const data = new FormData(event.target as HTMLFormElement);
        const newEmail = String(data.get('email'));
        if (newEmail !== (document.getElementById('emailconf') as HTMLInputElement).value) {
            //email y emailconf diferentes
            setDifferentEmail(true);
        }
        else if (!regEmail.test(newEmail)) {
            //email invalido
            setInvalidEmail(true);
        }
        else {
            db.getProfesoresDB().putUser(metadata.name, {
                metadata: {
                    email: newEmail,
                }
            }).then(res => {
                setShowModalEmail(false);
                setToastColor("success");
                setToastMsg("El email se ha cambiado con éxito");
                setToast(true);
                setEmail(newEmail);
            }).catch(err => {
                setToastColor("danger");
                setToastMsg("Error al cambiar el email");
                setToast(true);
            });
        }
    }

    function handleSubmitPass(event: FormEvent) {
        event.preventDefault();
        setInvalidPass(false);
        setDifferentPass(false);
        const data = new FormData(event.target as HTMLFormElement);
        const pass = String(data.get('pass'));
        if (pass !== (document.getElementById('passConf') as HTMLInputElement).value) {
            //pass y passconf diferentes
            setDifferentPass(true);
        }
        else if (!regPass.test(pass)) {
            //pass invalido
            setInvalidPass(true);
        }
        else {
            db.getProfesoresDB().changePassword(metadata.name, pass)
                .then(res => {
                setShowModalPass(false);
                setToastColor("success");
                setToastMsg("La contraseña se ha cambiado con éxito");
                setToast(true);
                if (sessionPropia.name === dniUser) {
                    history.push('/logIn');
                }
                }).catch(err => {
                setToastColor("danger");
                setToastMsg("Error al cambiar la contraseña");
                setToast(true);
            });
        }
    }

    function handleEliminarUsuario(event: any) {
        db.getProfesoresDB().deleteUser(dniUser)
            .then(res => {
                setToastColor("success");
                setToastMsg("Se ha eliminado al usuario con éxito");
                setToast(true);
                return (<Redirect to="/usuarios/existentes" />);
            }).catch(err => {
                setToastColor("danger");
                setToastMsg("ERROR al eliminar al usuario");
                setToast(true);
            });
    }

    const renderOpcionesAdmin = () => {
        if ((sessionPropia.roles.indexOf(ADMIN_NAME) !== -1) && (sessionPropia.name !== dniUser)) {
            return (
                <div>
                    <IonItem>
                        <IonLabel >Administrador?</IonLabel>
                        <IonCheckbox
                            checked={isAdmin}
                            onClick={() => {
                                if (!isAdmin) {
                                    const arr = roles.slice();
                                    arr.push(ADMIN_NAME)
                                    db.getUsersDB().putUser(dniUser, {
                                        roles: arr,
                                    }).then(rta => {
                                        setToastColor("success");
                                        setToastMsg("Se ha convertido al usuario en admin");
                                        setToast(true);
                                        setIsAdmin(true);
                                    }).catch(err => {
                                        setToastColor("danger");
                                        setToastMsg("Error al convertir al usuario en admin");
                                        setToast(true);
                                    });
                                }
                                else {
                                    const arr = roles.slice();
                                    arr.splice(arr.indexOf(ADMIN_NAME), 1)
                                    db.getUsersDB().putUser(dniUser, {
                                        roles: arr,
                                    }).then(rta => {
                                        setToastColor("success");
                                        setToastMsg("El usuario ya no es admin");
                                        setToast(true);
                                        setIsAdmin(false);
                                    }).catch(err => {
                                        setToastColor("danger");
                                        setToastMsg("Error al quitar admin al usuario");
                                        setToast(true);
                                    });
                                }
                            }}>
                        </IonCheckbox>
                    </IonItem>
                    <IonItem class="botonCont">
                        <IonButton onClick={() => { setMostrarAlerta(true) }} color="primary" fill="outline" size="small">Eliminar usuario</IonButton>
                    </IonItem>
                </div>
            )
        }
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
            <IonHeader>
            </IonHeader>
            <IonContent>
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton
                        size="small"
                        onClick={() => {
                            if (sessionPropia.name !== dniUser) {
                                history.push(`/usuariosExistentes`)
                            }
                            else {
                                history.push(`/home`)
                            }
                            
                        }}
                    >
                        <IonIcon icon={arrowBack} />
                    </IonFabButton>
                </IonFab>
                <IonList>
                    <IonItem>
                        <IonLabel>
                            <h2> NOMBRE Y APELLIDO </h2>
                            <h3> {metadata.nombre} </h3>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>
                            <h2> DNI </h2>
                            <h3> {metadata.name} </h3>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>
                            <h2> EMAIL </h2>
                            <h3> {email} </h3>
                        </IonLabel>
                        <IonButton slot="end" onClick={() => setShowModalEmail(true)} >
                            <IonIcon icon={create} />
                        </IonButton>
                    </IonItem>
                    <IonItem>
                        <IonLabel>
                            <h2> CONTRASEÑA </h2>
                        </IonLabel>
                        <IonButton slot="end" onClick={() => setShowModalPass(true)} >
                            <IonIcon icon={create} />
                        </IonButton>
                    </IonItem>
                    {renderOpcionesAdmin()}
                </IonList>
                <IonAlert
                    isOpen={mostrarAlerta}
                    onDidDismiss={() => { setMostrarAlerta(false) }}
                    header='¿Realmente querés eliminar este usuario?'
                    subHeader='Esta acción no puede deshacerse.'
                    buttons={[{ text: 'Cancelar' }, { text: 'Eliminar', handler: handleEliminarUsuario }]}
                />
            </IonContent>
            <IonModal isOpen={showModalEmail}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>
                            Cambiar Email
                        </IonTitle>
                        <IonButtons slot="start">
                            <IonButton onClick={() => setShowModalEmail(false)}>
                                <IonIcon name="arrow-back"></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <form onSubmit={handleSubmitEmail}>
                        <IonItem>
                            <IonLabel position="floating">
                                <IonText class={(invalidEmail) ? 'label-login-warning' : 'label-modal'}>Nuevo correo electrónico</IonText>
                                <IonText class={(invalidEmail) ? 'regError' : 'esconder'}>El correo electrónico no es válido.</IonText>
                            </IonLabel>
                            <IonInput name='email' required type="email" ></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">
                                <IonText class={(differentEmail) ? 'label-login-warning' : 'label-modal'}>Confirmar nuevo correo electrónico</IonText>
                                <IonText class={(differentEmail) ? 'regError' : 'esconder'}>El correo electrónico no coincide.</IonText>
                            </IonLabel>
                            <IonInput id='emailconf' name='emailconf' required type="email" ></IonInput>
                        </IonItem>
                        <IonButton class='botLog' type='submit'>Cambiar email</IonButton>
                    </form>
                </IonContent>
            </IonModal>
            <IonModal isOpen={showModalPass}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>
                            Cambiar contraseña
                        </IonTitle>
                        <IonButtons slot="start">
                            <IonButton onClick={() => setShowModalPass(false)}>
                                <IonIcon name="arrow-back"></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <form onSubmit={handleSubmitPass}>
                        <IonItem>
                            <IonLabel position="floating">
                                <IonText class={(differentPass || invalidPass) ? 'label-modal-warning' : 'label-modal'}>Nueva contraseña</IonText>
                                <IonText class={(invalidPass) ? 'regError' : 'esconder'}>La contraseña contiene caracteres inválidos. Utilize caracteres alfanumericos /*-,.</IonText>
                            </IonLabel>
                            <IonInput id='pass' name='pass' required type="password" ></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">
                                <IonText class={(differentPass) ? 'label-modal-warning' : 'label-modal'}>Confirmar nueva contraseña</IonText>
                                <IonText class={(differentPass) ? 'regError' : 'esconder'}>Las contraseñas no coinciden.</IonText>
                            </IonLabel>
                            <IonInput id='passConf' name='passconf' required type="password"></IonInput>
                        </IonItem>
                        <IonButton class='botLog' type='submit'>Cambiar contraseña</IonButton>
                    </form>
                </IonContent>
            </IonModal>
        </IonPage>
    );
};

export default Configuracion;
/*UTF8*/