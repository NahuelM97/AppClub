import React, { useState, FormEvent, useEffect } from 'react';
import { IonPage, IonContent, IonLabel, IonInput, IonItem, IonText, IonCheckbox, IonButton, IonModal, IonAlert, IonToast } from '@ionic/react';
import logoClub from '../images/logoclub.jpg'
import '../theme/logIn.css';

import { maxNumDni, regEmail, regDni, regNombre, iProfesorPend } from '../interfaces';

import db from '../BD';

const base64 = require('base-64');
const utf8 = require('utf8');

const regPass = /^[A-Za-z0-9/*\-,.]+([A-Za-z0-9/*\-,.]+)*$/;


const profesor: iProfesorPend = {
    nombre: '',
    dni: '',
    email: '',
    pass: '',
}

interface iState {
    toastParams: {
        mostrar: boolean,
        mensaje: string,
    }
}

const LogIn: React.FC = () => {


    const [msjError, setMsjError] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showModalReg, setShowModalReg] = useState(false);
    const [differentDni, setDifferentDni] = useState(false);
    const [differentPass, setDifferentPass] = useState(false);
    const [showSuccessReg, setShowSuccessReg] = useState(false);
    const [noExistingUserLog, setNoExistingUserLog] = useState(false);
    const [incorrectPass, setIncorrectPass] = useState(false);
    const [invalidName, setIvalidName] = useState(false);
    const [invalidDni, setInvalidDni] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidPass, setInvalidPass] = useState(false);
    const [mostrarError, setMostrarError] = useState(false);
    const [differentEmail, setDifferentEmail] = useState(false);
    let cookieRec = getCookie("recordar");



    function handleSubmit(event: FormEvent) {

        
        event.preventDefault();
        const data = new FormData(event.target as HTMLFormElement);
        setMostrarError(false);
        setDifferentPass(false);
        setDifferentDni(false);
        setInvalidDni(false);
        setInvalidEmail(false);
        setInvalidPass(false);
        setIvalidName(false);
        setDifferentEmail(false);
        var aux = '';

        profesor.dni = String(data.get('dni'));
        profesor.pass = String(data.get('pass'));
        profesor.nombre = String(data.get('nombre')) + String(' '+data.get('apellido'));
        profesor.email = String(data.get('email'));



        if ((regNombre.test(profesor.nombre)) && (regDni.test(profesor.dni)) && (profesor.dni === data.get('dniconf')) && (regPass.test(profesor.pass)) && (profesor.pass === data.get('passconf')) && regEmail.test(profesor.email) && (profesor.email === data.get('emailconf'))) {

            aux = utf8.encode(profesor.pass);
            profesor.pass = base64.encode(aux);
            db.getPendientesDB().post(profesor)
                .then((respuesta) => {
                    if (respuesta.ok) {
                        setShowSuccessReg(true);
                    }
                    else
                        alert('Intente nuevamente');
                    (document.getElementById('registro') as HTMLFormElement).reset();
                })
                .catch((error) => {
                    (document.getElementById('dni') as HTMLInputElement).value = '';
                    (document.getElementById('dniconf') as HTMLInputElement).value = '';
                    (document.getElementById('pass') as HTMLInputElement).value = '';
                    (document.getElementById('passConf') as HTMLInputElement).value = '';
                    setMsjError('Error al registrarse, intente nuevamente.')
                    setMostrarError(true);
                })

        }
        else {

            //ERRORES EN LOS DATOS DE ENTRADA
            if (!regNombre.test(profesor.nombre)) {
                //nombre invalido
                (document.getElementById('nombre') as HTMLInputElement).value = '';
                (document.getElementById('apellido') as HTMLInputElement).value = '';
                (document.getElementById('pass') as HTMLInputElement).value = '';
                (document.getElementById('passConf') as HTMLInputElement).value = '';
                setIvalidName(true);
                setMsjError('Nombre o apellido con caracteres inválidos.');
                setMostrarError(true);
            }
            else {
                if (!regDni.test(profesor.dni)) {
                    //dni invalido
                    (document.getElementById('dni') as HTMLInputElement).value = '';
                    (document.getElementById('dniconf') as HTMLInputElement).value = '';
                    (document.getElementById('pass') as HTMLInputElement).value = '';
                    (document.getElementById('passConf') as HTMLInputElement).value = '';
                    setInvalidDni(true);
                    setMsjError('El DNI ingresado contiene caracteres inválidos.');
                    setMostrarError(true);
                }
                else {
                    if (profesor.dni !== data.get('dniconf')) {
                        // dni y dni conf diferentes
                        setDifferentDni(true);
                        (document.getElementById('dniconf') as HTMLInputElement).value = '';
                        (document.getElementById('pass') as HTMLInputElement).value = '';
                        (document.getElementById('passConf') as HTMLInputElement).value = '';
                        setMsjError('Ingrese el DNI correcto.');
                        setMostrarError(true); 
                    }
                    else {
                        if (!regPass.test(profesor.pass)) {
                            //contraseña con caracteres no validos
                            (document.getElementById('pass') as HTMLInputElement).value = '';
                            (document.getElementById('passConf') as HTMLInputElement).value = '';
                            setMsjError('La contraseña contiene caracteres inválidos. Utilize caracteres alfanumericos /*-,.');
                            setMostrarError(true);
                            setInvalidPass(true);
                        }
                        else {
                            if (profesor.pass !== data.get('passconf')) {
                                //pass y pass conf diferentes
                                (document.getElementById('pass') as HTMLInputElement).value = '';
                                (document.getElementById('passConf') as HTMLInputElement).value = '';
                                setDifferentPass(true); 
                                setMsjError('Ingrese la contraseña correcta.');
                                setMostrarError(true);
                            }
                            else {
                                if (!regEmail.test(profesor.email)) {
                                    //email invalido
                                    (document.getElementById('pass') as HTMLInputElement).value = '';
                                    (document.getElementById('passConf') as HTMLInputElement).value = '';
                                    setInvalidEmail(true); 
                                    setMsjError('El correo electrónico no es valido.');
                                    setMostrarError(true);
                                }
                                else {
                                    //email y emailconf diferentes
                                    (document.getElementById('pass') as HTMLInputElement).value = '';
                                    (document.getElementById('passConf') as HTMLInputElement).value = '';
                                    (document.getElementById('emailconf') as HTMLInputElement).value = '';
                                    setDifferentEmail(true); 
                                    setMsjError('El correo electrónico no coincide.');
                                    setMostrarError(true);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function logIn(event: FormEvent) {
        event.preventDefault();
        setIncorrectPass(false);
        setNoExistingUserLog(false);
        const data = new FormData(event.target as HTMLFormElement);
        const guardar = String(data.get("guardarUser"));
        const usuario = String(data.get('usuario'));
        const pass = String(data.get('pass'));
        var passAux;


        db.getProfesoresDB().logIn(usuario, pass)
            .then((respuesta) => {
                if (respuesta.ok) {
                    if (guardar === "on") {
                        //hacer hash contraseña
                        passAux = utf8.encode(pass);
                        passAux = base64.encode(passAux);
                        document.cookie = "username=" + usuario + "; expires=Thu, 18 Dec 2099 12:00:00 UTC";
                        document.cookie = "pass=" + passAux + "; expires=Thu, 18 Dec 2099 12:00:00 UTC";
                        document.cookie = "recordar=true; expires=Thu, 18 Dec 2099 12:00:00 UTC";
                    }
                    else {
                        if (getCookie("recordar") !== "") {
                            document.cookie = "recordar=; expires=Thu, 18 Dec 2009 12:00:00 UTC";
                            document.cookie = "username=; expires=Thu, 18 Dec 2009 12:00:00 UTC";
                            document.cookie = "pass=; expires=Thu, 18 Dec 2009 12:00:00 UTC";
                        }

                    }
                    window.location.href = '/home';
                }
                else
                    alert('Intente nuevamente');
            })
            .catch((error: Error) => {
                if (error.name === 'unauthorized') {
                    setNoExistingUserLog(true);
                    (document.getElementById('passlog') as HTMLInputElement).value = '';
                    setMsjError('Usuario o contraseña incorrectos.');
                    setMostrarError(true); 
                }
                else if (error.name === 'forbidden') {
                    setIncorrectPass(true);
                    (document.getElementById('passlog') as HTMLInputElement).value = '';
                    setMsjError('Ingrese correctamente la contraseña.');
                    setMostrarError(true); 
                }
                else {
                    setMsjError('Error al iniciar sesión, intente nuevamente.');
                    setMostrarError(true);
                }

            })
    }

    function getCookie(cname: string) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function obtenerPass(pass: string) {
        var passAux;

        passAux = base64.decode(pass);
        passAux = utf8.decode(passAux);
        
        return passAux;
    }

    useEffect(() => {
        (document.getElementById('usuario') as HTMLInputElement).value = (getCookie("recordar") === "") ? "" : getCookie("username");
        (document.getElementById('passlog') as HTMLInputElement).value = (getCookie("recordar") === "") ? "" : obtenerPass(getCookie("pass"));
        (document.getElementById('recUsCB') as HTMLIonCheckboxElement).checked = (getCookie("recordar") === "") ? false : true;
    }, [cookieRec]);

    return (
        <IonPage>
            <IonContent id="contLog">
                <h1>
                    LLEGO EL JG CT
                    <img id='logoClub' src={logoClub} alt="Logo del club" />
                </h1>
                <IonToast
                    isOpen={mostrarError}
                    onDidDismiss={() => setMostrarError(false)}
                    message={msjError}
                    color="danger"
                    duration={3500}
                    closeButtonText="CERRAR"
                />
                <form id='login' onSubmit={logIn}>
                    <IonItem id='div1'>
                        <IonLabel position="floating">
                            <IonText class={(noExistingUserLog) ? 'label-login-warning' : 'label-login'}>DNI</IonText>
                        </IonLabel>
                        <IonInput id='usuario' maxlength={maxNumDni} required name='usuario' type="text" ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">
                            <IonText class={(incorrectPass || noExistingUserLog) ? 'label-login-warning' : 'label-login'}>Contraseña</IonText>
                        </IonLabel>
                        <IonInput id='passlog' required name='pass' type={(showPass === true) ? 'text' : 'password'} ></IonInput>
                    </IonItem>
                    <div id='verPas'>
                        <IonLabel >Mostrar contraseña</IonLabel>
                        <IonCheckbox class='CB' onClick={() => setShowPass(!showPass)} ></IonCheckbox>
                    </div>
                    <div id='guardarUser'>
                        <IonLabel >Recordar usuario y contraseña</IonLabel>
                        <IonCheckbox id='recUsCB' name="guardarUser" class='CB'  ></IonCheckbox>
                    </div>
                    <IonButton type='submit' class='botLog' >Iniciar Sesión</IonButton>
                </form>
                <IonModal isOpen={showModalReg}>
                    <IonContent id="regModal">
                    <form id='registro' onSubmit={handleSubmit}>
                        <IonText class='warning'>Es obligatorio completar todos los campos.</IonText>
                        <IonItem>
                            <IonLabel position="floating"><IonText class={(invalidName) ? 'label-modal-warning' : 'label-modal'}>Nombre</IonText></IonLabel>
                            <IonInput id='nombre' name='nombre' required type="text" ></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">
                                <IonText class={(invalidName) ? 'label-modal-warning' : 'label-modal'}>Apellido</IonText>
                            </IonLabel>
                            <IonInput id='apellido' name='apellido' required type="text" ></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">
                                <IonText class={(invalidDni || differentDni) ? 'label-modal-warning' : 'label-modal'}>DNI</IonText>
                            </IonLabel>
                            <IonInput id='dni' name='dni' maxlength={maxNumDni} required type="text" min={"0"}></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">
                                <IonText class={(differentDni) ? 'label-modal-warning' : 'label-modal'}>Confirmar DNI</IonText>
                            </IonLabel>
                            <IonInput id='dniconf' name='dniconf' maxlength={maxNumDni} required type="text" ></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">
                                <IonText class={(differentPass || invalidPass) ? 'label-modal-warning' : 'label-modal'}>Contraseña</IonText>
                            </IonLabel>
                            <IonInput id='pass' name='pass' required type="password" ></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">
                                <IonText class={(differentPass) ? 'label-modal-warning' : 'label-modal'}>Confirmar contraseña</IonText>
                            </IonLabel>
                            <IonInput id='passConf' name='passconf' required type="password"></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">
                                    <IonText class={(invalidEmail) ? 'label-modal-warning' : 'label-modal'}>Correo electrónico</IonText>
                            </IonLabel>
                            <IonInput name='email' required type="email" ></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">
                                    <IonText class={(differentEmail) ? 'label-modal-warning' : 'label-modal'}>Confirmar correo electrónico</IonText>
                            </IonLabel>
                            <IonInput id='emailconf' name='emailconf' required type="email" ></IonInput>
                        </IonItem>
                        <IonAlert
                            isOpen={showSuccessReg}
                            onDidDismiss={() => { setShowSuccessReg(false); setShowModalReg(false); }}
                            header={'Solicitud de cuenta creada con éxito!'}
                            message={'Cierre para continuar.'}
                            buttons={['Cerrar']}
                        />
                        <div>
                            <IonButton type='submit' class='botLog'>Registrarse</IonButton>
                                <IonButton onClick={() => {
                                setShowModalReg(false);
                                (document.getElementById('pass') as HTMLInputElement).value = '';
                                (document.getElementById('passConf') as HTMLInputElement).value = '';
                            }
                            } class='botLog'>Cancelar</IonButton>
                        </div>
                        </form>
                    </IonContent>
                </IonModal>
                <IonButton class='botLog' onClick={() => setShowModalReg(true)}>Registrarse</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default LogIn;
/*UTF8*/