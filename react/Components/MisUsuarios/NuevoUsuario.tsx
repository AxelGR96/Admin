import React, { FC,useState } from 'react'
import {Button,Input} from "vtex.styleguide"
import { IconPlus,IconArrowBack,Alert } from 'vtex.styleguide'
import useUsuariosStore from '../Context/UsuariosContext'
import RegistroNuevoUsuario from './RegistroNuevoUsuario'

/*Defino un type donde obtendre los datos de mi componente padre
- screenUser = Accion para regresar a la pantalla de inicio
- userData = Aqui voy a recibir los datos de mi usuario
*/
type newUserScreen = {
    screenUser?: () => void,
    userData?: any,
}

const NuevoUsuario: FC<newUserScreen> = ({screenUser,userData}) => {

    //Me traigo la información de mi context para la peticion de mi api
    const UsuarioStore = useUsuariosStore()

    //Defino el estado de la pantalla cuando se registra un nuevo usuario
    const [screenNewUser, setScreenNewUser] = useState(0)

    //Defino un estado para mi alert success
    const [successA, setSuccessA] = useState(1)

    //Defino un estado para mi alert error
    const [errorAlert, setErrorAlert] = useState(1)

    //Defino un estado para registrar usuario
   // const [registerUser, setRegisterUser] = useState(false)

    //Estado del valor del email ingresado
    const [email, setEmail] = useState('')

    //Estado si ahi errores de validacion del input
    const [errorMessage, setErrorMessage] = useState('')
    

    //Metodo para validar el email formato
    const emailValidation = (email: any) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    //Metodo del manejo del cambio de mi email
    const handleEmailChange = (e: any) => {
    const newEmail = e.target.value
    setEmail(newEmail)

    /*
    - Una vez recibido mi email, hago uso de mi metodo de validación
    - Dentro del If si no truena mando como vacio el estado del error  y en caso contrario mando un mensaje
    */
    if (emailValidation(newEmail)) {
        setErrorMessage('')
    } else {
      setErrorMessage('Por favor, ingrese un email válido.')
    }
  }

    /*Metodo del boton Agregar usuario
    - Se va ser uso de la api -> https://integraciones.cadeco.com.mx/vtex/api/usuario/cliente-asignado
    - Parametros: IdCliente, email, esPropetario
    */
    const createUser = () => {
        //Validación si el email no esta vacio, ejecuta la api
        if(email != ''){
            console.log("email: ",email);
            console.log("User Data: ",userData)
            //Obtengo los parametros en una variable independiente cada una
            const esPropetario = userData.esPropietario
            const idCliente = userData.idCliente
            const emailValidated = email
            //Ejecuto la Api desde mi UsuarioContext
            const response = UsuarioStore.setCreateUserVtex(emailValidated,idCliente,esPropetario)
            console.log("loading",UsuarioStore.loading);
            console.log("errror",UsuarioStore.error);
            console.log(successA);

            //En mi response ejecuto el then para manipular lo que se realizara dependiendo del status recibido
            response.then((result: any) => {
                console.log("eeee",result);
                //Si el status es 200 ejecuta el Alert de Exito y limpia mi input(pendiente: preguntar Joel)
                if(result.status == 200){
                    setSuccessA(0)
                    setEmail('')//No lo hace ¿porque?
                }
                //Si el status es diferente de 200, el correo no esta registrado y redirige a pantalla de registro
                if(result.status != 200){
                    console.log("entreo aqui");
                    setScreenNewUser(1)
                }
            })
        }
        //Si el email viene vacio ejecuta el Alert de Error
        else{
            console.log("Input vaciooo")
            setErrorAlert(0)
            console.log("alert eerror: ",errorAlert)
        }
        
    }

    //Metodo para cerrar el Alert de Exito
    const successUser = () =>{
        console.log("Exito");
        setSuccessA(1)
    }

    //Metodo para cerrar el Alert de Error
    const errorUser = () => {
        console.log("Error User");
        setErrorAlert(1);
    }
    const redirectNuevoUsuario = () => {
        setScreenNewUser(0)
        console.log("si llego aqui...");
    }
  return (
    <>
        <div className='flex flex-row'>
            <div className='flex flex-column w-75'>
                <div className='flex flex-row justify-between'>
                    <div className='f3'>Información del Usuario</div>
                    <div>
                        <Button variation="primary" onClick={screenUser}>
                            <span className="flex items-center">
                                <IconArrowBack /> 
                                <span className="ml2">Regresar</span>
                            </span>
                        </Button>
                    </div>
                </div>
                
                 {screenNewUser == 0 && <div className='flex flex-row items-center justify-between    w-100 mt7'>
                    <div className='w-60'>
                        <Input  placeholder="example@cadeco.com.mx" size="large" label="Email"
                         onChange={handleEmailChange}
                         errorMessage={errorMessage} 
                         />
                    </div>

                    <div className='w-32 mt4 pt2'>
                        <Button variation="primary"  
                        onClick={createUser}
                        disabled={!!errorMessage}>
                            <span className="flex items-center">
                                <IconPlus /> 
                                <span className="ml2">Agregar Usuario</span>
                            </span>
                        </Button>
                    </div>
                </div>}

                {screenNewUser == 1 && <RegistroNuevoUsuario backNuevoUsuario={redirectNuevoUsuario} />}

                {successA == 0 && <div className='mt5'> <Alert  type="success" onClose={successUser}>
                    ¡Usuario Agregado con Exito!
                </Alert></div>}

                {errorAlert == 0 && <div className='mt5'> <Alert  type="error" onClose={errorUser}>
                    ¡Error, ingrese un correo en el cuadro de texto!
                </Alert></div>}

            </div>
        </div>
    </>
  )
}

export default NuevoUsuario
