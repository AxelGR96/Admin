import React from 'react'
import ClienteType from '../Types/ClienteType'
import { FC } from 'react'


interface PropsClientes {
    clientes: ClienteType
}

const CardUsuarios: FC<PropsClientes> = ({clientes}) => {
  return (
    <> 
        <div className='flex flex-row items-center ma4 pa4 bw2 bl b--action-primary'>
            <div className='w-30 w-10-ns mr4'>
                <svg width={90} height={90} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12.12 12.78a.963.963 0 0 0-.24 0 3.27 3.27 0 0 1-3.16-3.27c0-1.81 1.46-3.28 3.28-3.28a3.276 3.276 0 0 1 .12 6.55ZM18.74 19.38A9.934 9.934 0 0 1 12 22c-2.6 0-4.96-.99-6.74-2.62.1-.94.7-1.86 1.77-2.58 2.74-1.82 7.22-1.82 9.94 0 1.07.72 1.67 1.64 1.77 2.58Z' stroke='#292D32' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z' stroke='#292D32' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /></svg>
            </div>

            <div className='flex flex-column ml13 w-50'>
                <div className='ml13 mv2'>{clientes.nombre}</div>
                <div className='ml13 mv2'>Sucursal: {clientes.Sucursal.id} - {clientes.Sucursal.descripcion}</div>
                <div className='ml13 mv2'>Número de cliente: {clientes.idCliente}</div>
                <div className='ml13 mv2'>RFC: {clientes.RFC}</div>
           </div>
        </div>      
    </>
  )
}

export default CardUsuarios
