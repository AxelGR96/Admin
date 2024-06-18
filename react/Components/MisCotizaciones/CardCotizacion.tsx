import React, { FC } from 'react'
import ListCotizacionesType from '../Types/ListCotizacionesType'
import useDetalleCotizacionStore from '../Context/DetalleCotizacionContext'

interface propsCot {
  fecha: string
  cadecoQuoteId: number
  link: string
  labellink: string
  dataItem: ListCotizacionesType
}

const CardCotizacion: FC<propsCot> = ({fecha, cadecoQuoteId, link, labellink, dataItem}) => {
  const DetalleCotizacionStore = useDetalleCotizacionStore()

  const getCotizacionProducts = () => {
    DetalleCotizacionStore.setDetalleCotizacion(`${dataItem.idCotizacion}`)
    window.scrollTo(0, 50)
  }

  return (
    <div className='fl mv4 ph2 w-100 w-50-ns w-33-l f6'>
      <div className='br3 pv3 ph4 bw1 b--solid b--muted-4 h-100'>
        <div className='flex flex-column'>
          <div className='flex flex-row items-center mv3 mh4 overflow-hidden'>
            <div className='b'>{dataItem.Cliente.nombre}</div>
          </div>
          <div className='flex flex-row justify-between items-center mb7 mv3 mh4'>
            <div className='flex flex-column items-center justify-center'>
              <div className='b'>{`${dataItem.sucursal}/${cadecoQuoteId}`}</div>
            </div>
            <div className='flex flex-column items-center justify-center'>
              <div className='b'>{new Date(fecha).toLocaleDateString()}</div>
            </div>
            <div className='flex flex-column items-center justify-center w-40'>
              <div className={`b br4 ph5 pv3 truncate w-100 tc ${dataItem.Estatus === 'Facturado' ? 'c-success bg-success--faded' : (dataItem.Estatus === 'Cotizado' ? 'c-warning bg-warning--faded' : 'bg-washed-blue c-muted-1')}`}>{dataItem.Estatus}</div>
            </div>
          </div>
          <div className='flex flex-row justify-between items-center mh4 mv3'>
            <div className='flex flex-row items-center justify-center'>
              {
                dataItem.facturas && dataItem.facturas.length > 0 && (
                  <>
                    <a className='flex flex-row items-center justify-center black-90 b w-50 mh3' href={dataItem.facturas[0].comprobanteFiscal?.urlPDF} target='_blank' rel='noopener noreferrer'><svg width={24} height={24} fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 11v6l2-2M9 17l-2-2' stroke='#000' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5' stroke='#000' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M22 10h-4c-3 0-4-1-4-4V2l8 8Z' stroke='#000' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /></svg> PDF</a>
                    <a className='flex flex-row items-center justify-center black-90 b w-50 mh3' href={dataItem.facturas[0].comprobanteFiscal?.urlXML} target='_blank' rel='noopener noreferrer'><svg width={24} height={24} fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 11v6l2-2M9 17l-2-2' stroke='#000' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5' stroke='#000' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M22 10h-4c-3 0-4-1-4-4V2l8 8Z' stroke='#000' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /></svg> XML</a>
                  </>
                )
              }
            </div>
            <div className='flex flex-row items-center justify-center'>
              <div className='b'>{`Total: $${dataItem.subtotal} ${dataItem.Moneda}`}</div>
            </div>
          </div>
          <div className='flex flex-row items-center mv2'>
            <div className='flex flex-column items-center justify-center w-50'>
              <div className='pv3 ph4 w-80 tc br1 b pointer' onClick={getCotizacionProducts}>
                <a rel='noopener' className='black-90'>
                  {labellink}
                </a>
              </div>
            </div>
            <div className='flex flex-column items-center justify-center w-50'>
              <div className='pv3 ph4 w-100 tc br1 b'>
                {link !== '' &&
                  <a href={link} target='_blank' className='black-90' rel='noreferrer'>
                    Ir a la cotización
                  </a>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardCotizacion
