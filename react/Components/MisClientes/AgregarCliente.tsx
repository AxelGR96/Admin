import React, { useEffect, useState } from 'react'
import { PageHeader, InputSearch, Spinner } from 'vtex.styleguide'
import useClientesStore from '../Context/ClientesContext'
import { useRenderSession } from 'vtex.session-client'
import useAgregarClienteStore from '../Context/AgregarClienteContext'
import AgregarClienteType from '../Types/AgregarClienteType'
import Loading from '../Utils/Loading'
import TokenClienteType from '../Types/TokenClienteType'

const AgregarCliente = () => {
  const ClientesStore = useClientesStore()
  const AgregarClienteStore = useAgregarClienteStore()
  const clientesAsignados = AgregarClienteStore.clientesAsignados as AgregarClienteType[] | null
  const loading = AgregarClienteStore.loading
  const isError = AgregarClienteStore.error
  const exito = AgregarClienteStore.exito
  const token = AgregarClienteStore.token as TokenClienteType | null
  const dataUser: any = useRenderSession().session || null

  const [clienteSeleccionado, setClienteSeleccionado] = useState<AgregarClienteType | null>()
  const [buscarRfc, setBuscarRfc] = useState('')
  const [tokenCliente, setTokenCliente] = useState('')

  useEffect(() => {
    document.title = 'Mis Clientes | Cadeco'
  }, [dataUser?.namespaces?.profile.email.value])

  useEffect(() => {
    if (!!clientesAsignados)
      setClienteSeleccionado(clientesAsignados[0])
  }, [clientesAsignados])
  
  const backMisClientes = () => {
    AgregarClienteStore.limpiarStore()
    ClientesStore.openAddCliente(false)
  }

  const searchRfc = (rfc: string) => {
    if (rfc.length <= 11) return
    AgregarClienteStore.setAgregarCliente(rfc)
  }

  const GenerarToken = () => {
    if(!clienteSeleccionado) return
    AgregarClienteStore.postGenerarToken(clienteSeleccionado.idCliente.toString(), dataUser?.namespaces?.profile.email.value)
  }

  const ValidarToken = async () => {
    AgregarClienteStore.postValidarToken(token!!.idEmailToken, tokenCliente, clienteSeleccionado!!.idCliente.toString(), dataUser?.namespaces?.profile.email.value)
  }

  // const Registrarse = () => {

  // }

  return (
    <>
      <PageHeader
        title='Agregar Cliente'
        linkLabel='ATRÁS'
        onLinkClick={backMisClientes}
      />
      <div className='w-80 mv4 ph4'>
        {loading && (
          <div className='flex flex-column items-center justify-center w-100'><Spinner /></div>
        )}
        {loading && <Loading />}
        {!loading && !exito && !token && (
          <div className='flex flex-column'>
            <div className='b f3 mv3'>
              Identifica tu cliente CADECO
            </div>
            <div className='mt3 mb5'>
              Para poder generar la factura es necesarío ligar tu cliente CADECO. Al mismo tiempo a partir de ahora podras revisar tus cotizaciónes, facturas, notas de crédito, cotizar en linea, revisar existencias y tiempos de entrega.
            </div>
            <div className='mt4 mb5'>
              <div className='w-50'>
                <InputSearch
                  label='RFC'
                  placeholder='Ingresa el RFC del cliente'
                  size='regular'
                  value={buscarRfc}
                  onChange={(e: any) => {searchRfc(e.target.value); setBuscarRfc(e.target.value)}}
                  onSubmit={(e: any) => {
                    e.preventDefault()
                    searchRfc(e.target.value)
                  }}/>
              </div>
              <div className='flex flex-column mv2 w-100'>
                <div className='mv1'>Selecciona tu Cliente</div>
                <div className='mv1 relative'>
                  <select
                    className={`${isError ? 'b--danger' : 'b--muted-3'} selectNoIcon w-100 br2 h-regular pointer pr8`}
                    name='selectCliente'
                    id='selectCliente'
                    onChange={({ target }) => {
                      const selectedClient = clientesAsignados?.find(
                        (c) => c.idCliente.toString() === target.value.toString()
                      ) || null
                      setClienteSeleccionado(selectedClient)
                    }}
                  >
                    {isError && (
                      <option key='' value='' selected disabled>Cliente No Encontrado</option>
                    )}
                    {clientesAsignados && clientesAsignados.map((cliente, index) => {
                      const { idCliente, nombre } = cliente
                      return (
                        <option key={idCliente} value={idCliente} selected={index === 0}>
                          {nombre}
                        </option>
                      )
                    })}
                  </select>
                </div>
                {isError && (
                  <div className='mv1'>
                    <div className='br2 ph1 pv3 flex flex-row items-center' style={{ backgroundColor: '#ff8080' }}>
                      <svg xmlns='http://www.w3.org/2000/svg' width={28} height={28} viewBox='0 0 24 24' fill='none'><path d='M12 7.75V13M21.08 8.58v6.84c0 1.12-.6 2.16-1.57 2.73l-5.94 3.43c-.97.56-2.17.56-3.15 0l-5.94-3.43a3.15 3.15 0 0 1-1.57-2.73V8.58c0-1.12.6-2.16 1.57-2.73l5.94-3.43c.97-.56 2.17-.56 3.15 0l5.94 3.43c.97.57 1.57 1.6 1.57 2.73Z' stroke='#000' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M12 16.2v.1' stroke='#000' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' /></svg>
                      <div className='ml2'>Cliente no encontrado, favor de revisar el RFC o <span className='b'>Registrarse</span></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='flex flex-row justify-around items-center'>
              {/* <div className='b bg-warning white tc br3 pv4 ph3 w-40 pointer' onClick={Registrarse}>Registrarse</div> */}
              <div className='b bg-white ba bw1 b--warning br3 tc pv4 ph3 w-40 c-warning pointer' onClick={GenerarToken}>Ligar Cliente</div>
            </div>
          </div>
        )}
        {!loading && !exito && !!token && (
          <div className='ph7 pv4'>
            <div className='flex flex-column'>
              <div className='b f3 mv3 tc'>
                Clave de Acceso CADECO
              </div>
              <div className='mt3 mb5 tc'>
                Para poder continuar ingresa el código que fue recibido a través del correo:
                <div className='b'>{token?.emailDestino}</div>
              </div>
              <div className='flex flex-row justify-center items-center mt4 mb5'>
                <div className='flex flex-row justify-center items-center mv2'>
                  <div className='mv1 w-50'>
                    <input
                      type='text'
                      className='b--warning br2 h-large tc w-100'
                      value={tokenCliente}
                      onChange={({ target }) => setTokenCliente(target.value)}
                    />
                  </div>
                </div>
              </div>
              {isError && (
                <div className='mb5'>
                  <div className='br2 ph1 pv3 flex flex-row items-center' style={{ backgroundColor: '#ff8080' }}>
                    <svg xmlns='http://www.w3.org/2000/svg' width={28} height={28} viewBox='0 0 24 24' fill='none'><path d='M12 7.75V13M21.08 8.58v6.84c0 1.12-.6 2.16-1.57 2.73l-5.94 3.43c-.97.56-2.17.56-3.15 0l-5.94-3.43a3.15 3.15 0 0 1-1.57-2.73V8.58c0-1.12.6-2.16 1.57-2.73l5.94-3.43c.97-.56 2.17-.56 3.15 0l5.94 3.43c.97.57 1.57 1.6 1.57 2.73Z' stroke='#000' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M12 16.2v.1' stroke='#000' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' /></svg>
                    <div className='ml2'>El código no es valido. Verifique la información e intente nuevamente.</div>
                  </div>
                </div>
              )}
              <div className='flex flex-row justify-center items-center'>
                <div className='b bg-warning white tc br3 pv4 ph3 w-40 pointer' onClick={ValidarToken}>Validar</div>
              </div>
            </div>
          </div>
        )}
        {!loading && exito && (
          <div className='flex flex-column justify-center items-center w-100'>
          <div className='ph7 pv4'>
            <div className='flex flex-column'>
              <div className='b f3 mv3 tc'>
                LIGADO CON ÉXITO
              </div>
              <div className='mt3 mb6'>
                Ahora podrás disfrutar de todos los beneficios a partir de este momento.
              </div>
              <div className='flex flex-row justify-center items-center mv4'>
                <div className='bg-warning white tc br3 pv4 ph3 w-60 pointer' onClick={backMisClientes}>Volver a Mis Clientes</div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  )
}

export default AgregarCliente