import React, {useEffect } from 'react'
import { Spinner } from 'vtex.styleguide'
import { useRenderSession } from 'vtex.session-client'
import Loading from '../Utils/Loading'
import useUsuariosStore from '../Context/UsuariosContext'
import ClienteType from './../Types/ClienteType';
import ErrorMyAccount from '../Utils/ErrorMyAccount'
import getMisClientesVtex from '../../graphql/getMisClientes.graphql'
import { useLazyQuery } from 'react-apollo'
import CardUsuarios from './CardUsuarios'
import AgregarUsuarios from './AgregarUsuarios'
import getDocument from '../../graphql/getDocument.graphql'

const MisUsuarios = () => {
  const UsuariosStore = useUsuariosStore()
  const clientes = UsuariosStore.clientes as ClienteType[] | null
  const loading = UsuariosStore.loading
  const error = UsuariosStore.error
  const dataUser: any = useRenderSession().session || null
  const [getMisClientes, misClientes] = useLazyQuery(getMisClientesVtex)
  const [getData,  data ] = useLazyQuery(getDocument);
  
 //Consulto los datos en el Graphql que me da los clientes
  useEffect(() => {
    document.title = 'Mis Usuarios | Cadeco'
    if(dataUser != null)
      getMisClientes({variables: {email: dataUser?.namespaces?.profile.email.value}})
  }, [dataUser?.namespaces?.profile.email.value])

  //Seteo la informacion de clientes en mi context de zustand y de esta forma se llena el useeffect anterior
  useEffect(() => {
    if(!!misClientes.data) 
      UsuariosStore.setClientesVtex(misClientes.data.clientesAsignadosVtex)
    if(!!misClientes.error)
      UsuariosStore.setError(true)
    UsuariosStore.setLoading(misClientes.loading)
  }, [misClientes])

  useEffect(() => {
    console.log("se monta el componente");

    if(clientes && clientes.length > 0){
      console.log("List Clientes...",clientes);
      /*const filterCustomer = clientes?.filter(cliente => cliente.esPropietario)
      console.log("filter Customer",filterCustomer)
      const customerMap = filterCustomer?.map(cliente => cliente.idCliente).toString()
      console.log(customerMap)
      const condition = `ClienteCadeco=${customerMap}`*/

      //console.log("condition: ",condition)
      getData({
        variables: {
          customer: "ClienteCadeco=175236"
        },
      })
    }    
  },[clientes])

  useEffect(() => {
    
    if(data){
      console.log("si viene la data llenaaa");
      console.log(data);
    }
  },[data])
  
  return(
    <>
    <div className='flex flex-column ph5 w-100'>
     
      {loading && <div className='flex flex-column items-center justify-center w-100'><Spinner /></div>}
      {loading && <Loading />}
      {error && ErrorMyAccount('Error en la consulta de clientes.',() => {} )}
      {!loading && !error &&  clientes?.filter(cliente => cliente.esPropietario)?.map((cliente)=>
        <CardUsuarios key={cliente.idCliente} clientes={cliente} />
      )}
      {!loading && !error && clientes?.filter(cliente => cliente.esPropietario)?.map((cliente) =>
        <AgregarUsuarios key={cliente.idCliente} userData={cliente} />
      )}
    </div>
    </>
  )
}
export default MisUsuarios