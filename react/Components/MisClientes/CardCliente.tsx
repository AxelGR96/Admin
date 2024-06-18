import React, { FC, useState } from 'react'
import ClienteType from '../Types/ClienteType'
import useClientesStore from '../Context/ClientesContext'

interface propsCli {
  cliente: ClienteType
  email: string
}

const CardCliente: FC<propsCli> = ({ cliente, email }) => {
  const ClientesStore = useClientesStore()

  const [deleteCli, setDeleteCli] = useState(false)

  const deleteCliente = () => {
    ClientesStore.deleteCliente(email, cliente.idCliente.toString())
    setDeleteCli(true)
  }

  return (
    <>
      {!deleteCli && (
        <div className='flex flex-row ma4 bw2 items-center bl pa4 b--action-primary'>
          <div className='w-30 w-10-ns mr4'>
            <svg width={90} height={90} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12.12 12.78a.963.963 0 0 0-.24 0 3.27 3.27 0 0 1-3.16-3.27c0-1.81 1.46-3.28 3.28-3.28a3.276 3.276 0 0 1 .12 6.55ZM18.74 19.38A9.934 9.934 0 0 1 12 22c-2.6 0-4.96-.99-6.74-2.62.1-.94.7-1.86 1.77-2.58 2.74-1.82 7.22-1.82 9.94 0 1.07.72 1.67 1.64 1.77 2.58Z' stroke='#292D32' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z' stroke='#292D32' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /></svg>
          </div>
          <div className='flex flex-column ml3 w-50'>
            <div className='ml3 mr3 mv2'>{cliente.nombre}</div>
            <div className='ml3 mr3 mv2'>Sucursal: {cliente.Sucursal.id} - {cliente.Sucursal.descripcion}</div>
            <div className='ml3 mr3 mv2'>Número de cliente: {cliente.idCliente}</div>
            <div className='ml3 mr3 mv2'>RFC: {cliente.RFC}</div>
          </div>
          <button onClick={deleteCliente} className='flex flex-column items-center bw0 bg-transparent pointer'>
            <svg width={70} height={70} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path fill='#fff' d='M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5' stroke='red' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /></svg>
            Eliminar
          </button>
        </div>
      )}
    </>
  )
}

export default CardCliente