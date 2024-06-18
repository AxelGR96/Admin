import React, { useState } from 'react'
import { PageHeader, Button  } from 'vtex.styleguide'
import useDetalleCotizacionStore from '../Context/DetalleCotizacionContext'
import moment from 'moment'
import DetalleCotizacionType from '../Types/DetalleCotizacionType'

const DetalleCotizacion = () => {
  const DetalleCotizacionStore = useDetalleCotizacionStore()
  const detalleCot: DetalleCotizacionType | null = DetalleCotizacionStore.detalleCot

  const [openMoreInfo, setOpenMoreInfo] = useState(false)

  const backListCotizaciones = () => {
    DetalleCotizacionStore.setIsDetalle(false)
  }

  return(
    <>
      <PageHeader
        title='Detalle de cotizacion'
        linkLabel='ATRÁS'
        onLinkClick={backListCotizaciones}
      />
      <div className='w-100 mv4'>
        <div className='flex items-center w-100'>
          <div className='flex w-100 ph8'>
            <div className='flex w-100 flex-row bg-light-gray br3 br--top'>
              <div className='w-80'>
                <div className='flex w-100 flex-row'>
                  <div className='flex flex-column items-center justify-center pa4 w-33'>
                    <div className='truncate w-90 tc'>Cotización</div>
                    <div className='mt2 truncate w-90 tc'>{detalleCot?.sucursal.id}/{detalleCot?.cotizacion}</div>
                  </div>
                  <div className='flex flex-column items-center justify-center pa4 w-33'>
                    <div className='truncate w-90 tc'>Sucursal</div>
                    <div className='mt2 truncate w-90 tc'>{detalleCot?.sucursal.descripcion}</div>
                  </div>
                  <div className='flex flex-column items-center justify-center pa4 w-33'>
                    <div className='truncate w-90 tc'>Fecha de cotización</div>
                    <div className='mt2 truncate w-90 tc'>{moment(detalleCot?.fecha).lang("es").format('DD [de] MMMM [de] YYYY')}</div>
                  </div>
                </div>
                <div className='flex w-100 flex-row'>
                  <div className='flex flex-column items-center justify-center pa4 w-33'>
                    <div className='truncate w-90 tc'>Cliente</div>
                    <div className='mt2 truncate w-90 tc'>{detalleCot?.cliente.nombre}</div>
                  </div>
                  <div className='flex flex-column items-center justify-center pa4 w-33'>
                    <div className='truncate w-90 tc'>RFC</div>
                    <div className='mt2 truncate w-90 tc'>{detalleCot?.cliente.rfc}</div>
                  </div>
                  <div className='flex flex-column items-center justify-center pa4 w-33'>
                    <div className='truncate w-90 tc'>Moneda</div>
                    <div className='mt2 truncate w-90 tc'>{detalleCot?.moneda}</div>
                  </div>
                </div>
                {openMoreInfo && 
                  <>
                    <div className='flex w-100 flex-row'>
                      <div className='flex flex-column items-center justify-center pa4 w-33'>
                        <div className='truncate w-90 tc'>Orden de Compra</div>
                        <div className='mt2 truncate w-90 tc'>{detalleCot?.ordenCompra}</div>
                      </div>
                      <div className='flex flex-column items-center justify-center pa4 w-33'>
                        <div className='truncate w-90 tc'>Quien recibe</div>
                        <div className='mt2 truncate w-90 tc'>{detalleCot?.nombreReceptor}</div>
                      </div>
                      <div className='flex flex-column items-center justify-center pa4 w-33'>
                        <div className='truncate w-90 tc'>Número economico</div>
                        <div className='mt2 truncate w-90 tc'>{detalleCot?.noEconomico}</div>
                      </div>
                    </div>
                    <div className='flex w-100 flex-row'>
                      <div className='flex flex-column items-center justify-center pa4 w-33'>
                        <div className='truncate w-90 tc'>Requisición</div>
                        <div className='mt2 truncate w-90 tc'>{detalleCot?.noRequisicion}</div>
                      </div>
                      <div className='flex flex-column items-center justify-center pa4 w-33'>
                        <div className='truncate w-90 tc'>Usuario</div>
                        <div className='mt2 truncate w-90 tc'>{detalleCot?.usuario.nommbreCompleto}</div>
                      </div>
                      <div className='flex flex-column items-center justify-center pa4 w-33'>
                        <div className='truncate w-90 tc'>Correo</div>
                        <div className='mt2 truncate w-90 tc'>{detalleCot?.usuario.email}</div>
                      </div>
                    </div>
                  </>
                }
              </div>
              <div className='w-20 flex justify-center items-center'>
                <Button onClick={()=>setOpenMoreInfo(!openMoreInfo)}>
                  {!openMoreInfo ? 
                    <>
                      <div className='flex flex-row justify-center items-center w-100'>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none"><path stroke="#FFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12h12M12 18V6" /></svg>
                        <span>Ver más</span>
                      </div>
                    </>
                  : 
                    <>
                      <div className='flex flex-row justify-center items-center w-100'>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none"><path stroke="#FFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12h12" /></svg>
                        <span>Ver menos</span>
                      </div>
                    </>}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-column w-100 ph8'>
          <div className='dn db-ns w-100 ph5'>
            {detalleCot?.productos.map((prod) => {
              return (
                <div key={prod.numeroParte} className='flex flex-row justify-around mv4 pv3 ph4 br3 bw1 b--solid b--muted-4 w-100'>
                  <div className='flex justify-center items-center w-25'>
                    <img
                      src={prod.urlImg}
                      className={'w-70'}
                      alt="Imágen del producto"
                      crossOrigin='anonymous'/>
                  </div>
                  <div className='flex w-50 flex-column ph3 justify-center'>
                    <div className='mv2 f6'>{prod.descripcion}</div>
                    <div className='mv2 f6'><span className='b mr2'>Número de parte:</span><span>{prod.numeroParte}</span></div>
                    <div className='mv2 f6'><span className='b mr2'>Número de cotización:</span><span>{detalleCot.cotizacion}</span></div>
                    <div className='mv2 flex flex-row justify-between'><div className='f6'><span className='b mr2'>Precio:</span><span>${prod.precio}</span></div><div><span className='b mr2'>Cantidad:</span><span>{prod.cantidad}</span></div></div>
                    <div className='mv2 f6'><span className='b mr2'>Subtotal:</span>
                      <span>$
                        {detalleCot?.moneda == 'USD'
                          ? parseFloat(`${prod.subtotal}`).toFixed(2)
                          : parseFloat(`${prod.subTotalMXN}`).toFixed(2)}
                      </span>
                    </div>
                    <div className='mv2 f6'><span className='b mr2'>Total:</span>
                      <span>$
                        {detalleCot?.moneda == 'USD'
                          ? parseFloat(`${prod.total}`).toFixed(2)
                          : parseFloat(`${prod.totalMXN}`).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className='flex flex-column justify-center items-center w-25 ph5'>
                    <div className={`w-100 tc b br3 ph5 pv3 ${prod.descripcionEstatus === 'Facturado' ? 'c-success bg-success--faded' : (prod.descripcionEstatus === 'Cotizada' ? 'c-warning bg-warning--faded' : 'c-muted-1 bg-light-gray')}`}>{prod.descripcionEstatus}</div>
                  </div>
                </div>
              )
            })}
          </div>
          {detalleCot?.productos.map((item) => {
            return (
              <div key={item.numeroParte} className='card br2 bw1 b--solid b--muted-4 flex dn-ns flex-column w-100 ph6 pv5 mv3 br4'>
                <div className='b f5 mb3 tc'>No. Parte : {item.numeroParte}</div>
                <div className='b f6 mb3 flex justify-between '><div>Descripción : {item.descripcion}</div><div> Cantidad : {item.cantidad}</div></div>
                <div className='b f6 mb3 flex tr '>Precio : ${item.precio}</div>
                <div className='b f6 mb3 tl'>
                  Subtotal : ${detalleCot?.moneda == 'USD'
                  ? parseFloat(`${item.subtotal}`).toFixed(2)
                  : parseFloat(`${item.subTotalMXN}`).toFixed(2)}
                </div>
                <div className='b f6 mb3 tr'>
                  Total : ${detalleCot?.moneda == 'USD'
                  ? parseFloat(`${item.total}`).toFixed(2)
                  : parseFloat(`${item.totalMXN}`).toFixed(2)}
                </div>
                <div className='b f6 mb3 flex justify-center'>
                    <div className='flex items-center mr5 bg-yellow pa3 br3'>
                      {item.descripcionEstatus}
                    </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default DetalleCotizacion
