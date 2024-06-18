import React, { useEffect } from 'react'
import { useLazyQuery, useQuery } from 'react-apollo'
import { Button, Spinner, Tooltip } from 'vtex.styleguide'
import { useRenderSession } from 'vtex.session-client'
import { CircularProgressbarWithChildren, buildStyles  } from 'react-circular-progressbar'
import getProfile  from '../../graphql/getProfile.graphql'
import getEstadoCuenta  from '../../graphql/getEstadoCuenta.graphql'
import Loading from '../Utils/Loading'
import useCreditoStore from '../Context/CreditoContext'
import ErrorMyAccount from '../Utils/ErrorMyAccount'

const MiCredito = () => {
  const CreditoStore = useCreditoStore()
  const credito = CreditoStore.credito
  const isLoading = CreditoStore.loading
  const error = CreditoStore.error
  const dataUser: any = useRenderSession().session || null
  const {loading, data} = useQuery(getProfile)
  const [getEstado, estadoCuenta] = useLazyQuery(getEstadoCuenta)

  useEffect(() => {
    document.title = 'Mi Crédito | Cadeco'
    if(dataUser != null)
      CreditoStore.setCreditos(dataUser?.namespaces?.profile.email.value)
  }, [dataUser?.namespaces?.profile.email.value])

  useEffect(() => {
    if(credito != null)
      getEstado({variables: {idCliente: credito.idCliente}})
  }, [credito])

  return(
    <div className='flex flex-column ph5 w-100 mt5'>
      {isLoading && (<div className='flex flex-column items-center justify-center w-100'><Spinner /></div>)}
      {isLoading && <Loading />}
      {error && ErrorMyAccount('Error en la consulta de crédito.', ()=>{})}
      {!isLoading && !error && credito && (
        <div className='flex flex-column'>
          <div className='flex flex-row'>
            <div className='flex flex-column w-100 w-50-ns ph4'>
              <div className='f3 mb5 fw8'>Información</div>
              <div className='pv5 br3 bw1 b--solid b--muted-4 h-100'>
                <div className='bb b--light-gray pv4 flex flex-row items-center h-50 w-100'>
                  <div className='justify-center flex w-20 fl'>
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' className='icon line' width='32' height='32'><path id='primary' d='M12,21h0a9,9,0,0,1-9-9H3a9,9,0,0,1,9-9h0a9,9,0,0,1,9,9h0A9,9,0,0,1,12,21ZM12,7a4,4,0,1,0,4,4A4,4,0,0,0,12,7Zm2.17,7.35a3.95,3.95,0,0,1-4.34,0,7,7,0,0,0-4.28,3.92,9,9,0,0,0,12.81.09l.09-.09A7,7,0,0,0,14.17,14.35Z' style={{ fill: 'none', stroke: 'rgb(0, 0, 0)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2' }} /></svg>
                  </div>
                  <div className='w-80 fl ph4'>
                    <div className='f5 mb2'>Nombre </div>
                    <div className='f4 mb2 fw8'>{credito.nombre}</div>
                  </div>
                </div>
                <div className='pv4 flex items-center h-50 w-100'>
                  <div className='justify-center flex w-20 fl'>
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' className='icon line' width='32' height='32'><path id='primary' d='M15,21H3V4A1,1,0,0,1,4,3H14a1,1,0,0,1,1,1Zm0,0h6V7a1,1,0,0,0-1-1H15Zm-4,0V15H7v6ZM7,7h4M7,11h4' style={{ fill: 'none', stroke: 'rgb(0, 0, 0)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2' }} /></svg>
                  </div>
                  <div className='w-80 fl ph4'>
                    <div className='f5 mb2'>RFC </div>
                    <div className='f4 mb2 fw8'>{credito.rfc}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-column w-100 w-50-ns ph4'>
              <div className='f3 mb5 fw8'>Balance</div>
              <div className='flex flex-row items-center pv5 ph4 br3 bw1 b--solid b--muted-4 h-100'>
                <div className='w-40 ph5'>
                  <CircularProgressbarWithChildren value={credito.credito.disponible} maxValue={credito.credito.limite} styles={buildStyles({
                    trailColor: '#ff4c4c',
                    pathColor: '#fdba12',
                  })} strokeWidth={10}>
                    <div>Limite de Crédito</div>
                    <div>{(credito.credito.limite).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} USD</div>
                  </CircularProgressbarWithChildren>
                </div>
                <div className='flex flex-column justify-start items-start w-60 f4'>
                  <div className={`flex w-100 justify-center fw8 f3 mb4 ${credito.credito.estatus === 'Activo' ? 'c-success' : 'c-danger'}`}>
                      <div className='fl pr2'>{credito.credito.estatus}</div>
                      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' className='icon line' width='28' height='28'><path id='primary' d='M10,15h2.5A1.5,1.5,0,0,0,14,13.5h0A1.5,1.5,0,0,0,12.5,12h-1A1.5,1.5,0,0,1,10,10.5h0A1.5,1.5,0,0,1,11.5,9H14' style={{ fill: 'none', stroke: 'rgb(0, 0, 0)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2' }} /><path id='primary-2' data-name='primary' d='M12,9V8m0,8V15M12,3a9,9,0,1,0,9,9A9,9,0,0,0,12,3Z' style={{ fill: 'none', stroke: 'rgb(0, 0, 0)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2' }} /></svg>
                    </div>
                  <div className='flex w-100 justify-center b'>Saldos</div>
                  <div className='flex flex-row w-100 mv2 f5'>
                    <div className='w-50'>
                      Disponible <Tooltip label={'Saldo Actual'}><svg className='icon line pointer' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='16' height='16'><line id='primary-upstroke' x1='12.05' y1='8' x2='11.95' y2='8' style={{ fill: 'none', stroke: 'rgb(0, 0, 0)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2.6' }} /><path id='primary' d='M3,12a9,9,0,0,1,9-9h0a9,9,0,0,1,9,9h0a9,9,0,0,1-9,9h0a9,9,0,0,1-9-9Zm9,1v3' style={{ fill: 'none', stroke: 'rgb(0, 0, 0)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2' }} /></svg></Tooltip>
                    </div>
                    <div className='w-50 b tr'>
                      {(credito.credito.disponible).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} USD
                    </div>
                  </div>
                  <div className='flex flex-row w-100 mv2 f5'>
                    <div className='w-50'>
                      Utilizado <Tooltip label={'Saldo Pendiente'}><svg className='icon line pointer' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='16' height='16'><line id='primary-upstroke' x1='12.05' y1='8' x2='11.95' y2='8' style={{ fill: 'none', stroke: 'rgb(0, 0, 0)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2.6' }} /><path id='primary' d='M3,12a9,9,0,0,1,9-9h0a9,9,0,0,1,9,9h0a9,9,0,0,1-9,9h0a9,9,0,0,1-9-9Zm9,1v3' style={{ fill: 'none', stroke: 'rgb(0, 0, 0)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: '2' }} /></svg></Tooltip>
                    </div>
                    <div className='w-50 b tr'>
                      {(credito.credito.utilizado).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} USD
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-row ph4 mb4 mt4'>
            <div className='flex justify-start w-50'>
              {estadoCuenta.data && (
                <Button variation='primary' href={estadoCuenta.data.estadoCuenta.urlEstadoDeCuenta} target='_blank'>
                  Estado de Cuenta
                </Button>
              )}
            </div>
            <div className='flex justify-end w-50'>
              {!loading && data && data.profile.customFields[0].value && credito && (
                <Button variation='primary' href={`https://servicioalcliente.cadeco.com.mx/SolicitudCredito/Account/Login?email=${data.profile.email}&validador=${data.profile.customFields[0].value}`} target='_blank'>
                  {credito.credito.estatus === 'Inactivo' ? 'Solicitar crédito' : credito.credito.limite === 0 ? 'Aumenta o solicita un crédito' : 'Aumentar crédito'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MiCredito