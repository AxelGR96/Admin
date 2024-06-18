import React, { useState,useEffect, FC } from 'react'
import { IconWarning,Input,Button,Alert } from 'vtex.styleguide'
import createDocument from '../../graphql/createDocument.graphql'
import { useMutation } from 'react-apollo'

type RegistroNuevoUsuarioProps = {
  backNuevoUsuario: () => void,
}

const RegistroNuevoUsuario: FC<RegistroNuevoUsuarioProps> = ({backNuevoUsuario}) => {
  //Estado del mensaje de exito cuando se crea el usuario
  const [onsuccess,setOnSuccess] = useState(0)
  //Estado de error cuando el input de name se queda vacio
  const [errorName,setErrorName] = useState('')
  //Estado de error cuando el input de lastName se queda vacio
  const [errorLastName,setErrorLastName] = useState('')
  //Estado de error cuando el input de email se queda vacio
  const [erroremail,setErrorEmail] = useState('')
  //Estado del input de name
  const [firstname, setFirstName] = useState('')
  //Estado del input de apellido
  const [lastname, setLastName] = useState('')
  //Estado del input de email
  const [email, setEmail] = useState('')
  
  /*Mutation de GraphQL para ejecutar el query que crea el nuevo usuario
  - Parametros
      - createUser(Metodo que ejecuta el mutation)
      - loading: Carga del query
      - error: en caso de que halla error se va llenar
      - data: información que se va setear en caso de que sea exitosa el mutation
  */
  const [createUser,{loading,error,data}] = useMutation(createDocument)

  //Metodo de la validación del Email
  const validationEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  //Metodo para revisar el input del email y seteamos el estado
  const onChangeEmail = (e :any) => {
    const mail = e.target.value
    setEmail(mail)

    if(validationEmail(mail)){
      setErrorEmail('')
    }
    else{
      setErrorEmail('Por favor, ingrese un correo valido en el campo de texto')
    }
  }

  //Metodo para revisar el input del nombre y seteamos el estado
  const onChangeFirstName = (e: any) => {
    const name = e.target.value
    setFirstName(name)
    if(name){
      setErrorName('')
    }
    else{
      setErrorName('Por favor, ingrese un nombre en el campo de texto')
    }
  }

  //Metodo para revisar el input del apellido y seteamos el estado
  const onChangeLastName = (e: any) => {
    const lastName = e.target.value
    setLastName(lastName)
    if(lastName){
      setErrorLastName('')
    }
    else{
      setErrorLastName('Por favor, ingrese un apellido en el campo de texto')
    }
  }
  
  //Metodo del boton Agregar, que me crea el usuario con su respectivos parametros
  const createNewUser = () => {
    console.log("Email: ", email)
    console.log("nombre: ",firstname)
    console.log("Apellido: ",lastname)

   const res = createUser({
      variables: {
        email: email,
        firstname: firstname,
        lastname: lastname,
      },
    })
    console.log("Res",res);
    setEmail('')
    setFirstName('')
    setLastName('')
  }

  //Reseteo los inputs cuando es exitosa la creación
  useEffect(() => {
    console.log("dataaaaa");
    console.log("data",data);
    if(data){
      console.log('entro en la condicion....')
      setOnSuccess(1)
      setEmail('')
      setFirstName('')
      setLastName('')
      setTimeout(() => {
        setOnSuccess(0)
        backNuevoUsuario()
      }, 5000)
    }
  }, [data])


  const onSuccess = () => {setOnSuccess(0)}

  return (
    <>
    <div className='flex flex row mt8 justify-center '>
      <div>
        <IconWarning size={50}  color="red" />
      </div>

      <div className='flex flex-column ml5 justify-center'>
        <div>
          <span className='f3'>No encontramos el correo en nuestros registros.</span>
        </div>

        <div className='mb7'>
          <span className='f3'>¿Deseas Registrarlo?</span>
        </div>

        <div className='mb5'>
          <Input placeholder="Email" size="large" onChange={onChangeEmail} errorMessage={erroremail} />
        </div>

        <div className='mb5'>
          <Input placeholder="Nombre" size="large" onChange={onChangeFirstName} errorMessage={errorName} />
        </div>

        <div className='mb5'>
          <Input placeholder="Apellido" size="large" onChange={onChangeLastName} errorMessage={errorLastName} />
        </div>

        <div className='flex flex-row justify-center'>
          <div>
            <Button variation="primary" onClick={createNewUser} disabled={loading}>
              {loading ? 'Agregando...' : 'Agregar'}
              </Button>
          </div>
        </div>

        {error && 
        <div className='mt5 red'>
          <Alert type="error">
            Error: {error.message}
            </Alert></div>}

        {data && onsuccess == 1 &&
        <div className='mt5 green'>
          <Alert  type="success" onClose={onSuccess}>
          ¡Usuario creado exitosamente!
          </Alert></div>}
      </div>      
    </div>
    </>
  )
}
export default RegistroNuevoUsuario
