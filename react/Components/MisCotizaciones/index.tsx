import React from 'react'
import { Spinner } from 'vtex.styleguide'
import ListCotizaciones from './ListCotizaciones'
import useDetalleCotizacionStore from '../Context/DetalleCotizacionContext'
import Loading from '../Utils/Loading'
import DetalleCotizacion from './DetalleCotizacion'

const MisCotizaciones = () => {
  const DetalleCotizacionStore = useDetalleCotizacionStore()
  const isDetalle = DetalleCotizacionStore.isDetalle
  const loading = DetalleCotizacionStore.loading

  return(
    <>
      {loading && (
          <div className='flex flex-column items-center justify-center w-100'><Spinner /></div>
        )}
      {loading && <Loading />}
      {!loading && !isDetalle && <ListCotizaciones/>}
      {!loading && isDetalle && <DetalleCotizacion/>}
    </>
  )
}

export default MisCotizaciones
