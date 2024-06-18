import React, { useState, useEffect } from 'react'
import { PageHeader, Spinner, InputSearch, Button } from 'vtex.styleguide'
import { useRenderSession } from 'vtex.session-client'
import Loading from '../Utils/Loading'
import useClientesStore from '../Context/ClientesContext'
import ClienteType from './../Types/ClienteType';
import ErrorMyAccount from '../Utils/ErrorMyAccount'
import CardCliente from './CardCliente'
import getMisClientesVtex from '../../graphql/getMisClientes.graphql'
import { useLazyQuery } from 'react-apollo'

const MisClientes = () => {
  const ClientesStore = useClientesStore()
  const clientes = ClientesStore.clientes as ClienteType[] | null
  const loading = ClientesStore.loading
  const error = ClientesStore.error
  const dataUser: any = useRenderSession().session || null
  const [getMisClientes, misClientes] = useLazyQuery(getMisClientesVtex)
  const [listClientes, setListClientes] = useState(clientes)
  const [buscador, setBuscador] = useState('')

  useEffect(() => {
    document.title = 'Mis Clientes | Cadeco'
    if(dataUser != null)
      getMisClientes({variables: {email: dataUser?.namespaces?.profile.email.value}})
      //ClientesStore.setClientes(dataUser?.namespaces?.profile.email.value)
  }, [dataUser?.namespaces?.profile.email.value])

  useEffect(() => {
    setListClientes(clientes)
  }, [clientes])

  useEffect(() => {
    if(!!misClientes.data)
      ClientesStore.setMisClientesVtex(misClientes.data.clientesAsignadosVtex)
    if(!!misClientes.error)
      ClientesStore.setError(true)
    ClientesStore.setLoading(misClientes.loading)          
  }, [misClientes])

  const searchCliente = (value: string) => {
    const regex = new RegExp(value, 'i')
    setListClientes(clientes?.filter(cli => regex.test(cli.nombre) || regex.test(cli.idCliente.toString()) || regex.test(cli.RFC)) || null)
  }

  const clearBuscador = () => {
    setListClientes(clientes)
  }

  const addCliente = () => {
    ClientesStore.openAddCliente(true)
  }

  return(
    <>
      <div className='flex flex-column w-100'>
        <PageHeader
          title='Mis Clientes'
          linkLabel='ATRÁS'
          onLinkClick={() => {
            window.location.hash = "#/profile"
          }}
        />
        <div className='ph5 ph7-ns'>
          <Button onClick={addCliente}>
            Agregar Cliente
          </Button>
        </div>
      </div>
      <div className='flex flex-column ph5 w-100 mt5'>
        <div className='flex flex-row w-100 items-end justify-between'>
          <div className='w-70'>
            <InputSearch
              label='Buscar'
              placeholder='Buscar por nombre, apellido, RFC del cliente'
              size='regular'
              value={buscador}
              onClear={clearBuscador}
              onChange={(e: any) => setBuscador(e.target.value)}
              onSubmit={(e: any) => {
                e.preventDefault()
                searchCliente(e.target.value)
              }}/>
          </div>
          <div className='w-30 ph5'></div>
        </div>
        <div className='flex flex-column w-100 mt5'>
          {loading && (
            <div className='flex flex-column items-center justify-center w-100'><Spinner /></div>
          )}
          {loading && <Loading />}
          {error && ErrorMyAccount('Error en la consulta de clientes.', ()=>{})}
          {!loading && !error && listClientes?.map((cli) => 
            <CardCliente key={cli.idCliente} cliente={cli} email={dataUser?.namespaces?.profile.email.value}/>
          )}
        </div>
      </div>
    </>
  )
}

export default MisClientes