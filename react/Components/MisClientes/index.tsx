import React from 'react'
import { Spinner } from 'vtex.styleguide'
import Loading from '../Utils/Loading'
import MisClientesPage from './MisClientesPage'
import useClientesStore from '../Context/ClientesContext'
import AgregarCliente from './AgregarCliente'

const MisClientes = () => {
  const addCliente = useClientesStore().addCliente
  const loading = false

  return(
    <>
      {loading && (
          <div className='flex flex-column items-center justify-center w-100'><Spinner /></div>
        )}
      {loading && <Loading />}
      {!loading && !addCliente && <MisClientesPage/>}
      {!loading && addCliente && <AgregarCliente/>}
    </>
  )
}

export default MisClientes
