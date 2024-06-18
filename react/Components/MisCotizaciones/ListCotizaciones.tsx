import React, { useEffect, useRef, useState } from 'react'
import { useRenderSession } from 'vtex.session-client'
import { PageHeader, DatePicker, Dropdown, InputSearch, Spinner } from 'vtex.styleguide'
import moment from 'moment'
import getCotizacionesVtex  from '../../graphql/getCotizacionesVtex.graphql'
import useCotizacionStore from '../Context/CotizacionesContext'
import ListCotizacionesType from '../Types/ListCotizacionesType'
import CardCotizacion from './CardCotizacion'
import Loading from '../Utils/Loading'
import ErrorMyAccount from '../Utils/ErrorMyAccount'
import { useLazyQuery } from 'react-apollo'

const ListCotizaciones = () => {
  const CotizacionStore = useCotizacionStore()
  const cotizaciones = CotizacionStore.cotizaciones as ListCotizacionesType[] | null
  const loading = CotizacionStore.loading
  const errorCotizaciones = CotizacionStore.error
  const refDatePicker = useRef<HTMLInputElement | null>(null)
  const [getCotizaciones, cotis] = useLazyQuery(getCotizacionesVtex)

  const dataUser: any = useRenderSession().session || null

  const dateNow = moment().toDate()
  const [initDate, setInitDate] = useState(moment().subtract(14, 'd').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())
  
  const [noParte, setNoParte] = useState('')
  const [buscarPor, setBuscarPor] = useState('parte')
  const [buscador, setBuscador] = useState('')

  const [ctz, setCtz] = useState(cotizaciones)
  const [cotizadas, setCotizadas] = useState(0)
  const [facturadas, setFacturadas] = useState(0)
  const [porFacturar, setPorFacturar] = useState(0)
  const [borrarFiltroCot, setBorrarFiltroCot] = useState(false)
  const [borrarFiltroFac, setBorrarFiltroFac] = useState(false)
  const [borrarFiltroPor, setBorrarFiltroPor] = useState(false)

  const [openSearch, setOpenSearch] = useState(false)
  const [searchbyNum, setSearchByNum] = useState(false)

  useEffect(() => {
    if(dataUser != null)
      initListCotizaciones()
  }, [dataUser?.namespaces?.profile.email.value])

  useEffect(() => {
    setCtz(cotizaciones)
  }, [cotizaciones])

  useEffect(() => {
    if (!!cotis.data)
      CotizacionStore.setCotizacionesVtex(cotis.data.cotizacionesVtex)
    if(!!cotis.error)
      CotizacionStore.setError(true)
    CotizacionStore.setLoading(cotis.loading)
  }, [cotis])

  useEffect(() => {
    setCotizadas(ctz?.filter(({ Estatus }) => Estatus === 'Cotizado').length || 0)
    setFacturadas(ctz?.filter(({ Estatus }) => Estatus === 'Facturado').length || 0)
    setPorFacturar(ctz?.filter(({ Estatus }) => Estatus === 'Por Facturar' || Estatus === 'Pedido' || Estatus === 'Pedido, Por Facturar').length || 0)
  }, [ctz])

  const initListCotizaciones = () => {
    document.title = 'Mis Cotizaciones | Cadeco'
    getCotizaciones({variables: {email: dataUser?.namespaces?.profile.email.value, fechaInicial: moment(initDate).format('YYYY-MM-DD'), fechaFinal: moment(endDate).format('YYYY-MM-DD'), noParte: noParte}})
    //CotizacionStore.setCotizaciones(dataUser?.namespaces?.profile.email.value, moment(initDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'), noParte)
  }

  const searchCotizaciones = (value: string) => {
    if (value == ''){
      getCotizaciones({variables: {email: dataUser?.namespaces?.profile.email.value, fechaInicial: moment(initDate).format('YYYY-MM-DD'), fechaFinal: moment(endDate).format('YYYY-MM-DD'), noParte: noParte}})
      //CotizacionStore.setCotizaciones(dataUser?.namespaces?.profile.email.value, moment(initDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'), noParte)
    }
    else{
      //CotizacionStore.setCotizaciones(dataUser?.namespaces?.profile.email.value, moment(initDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'), value)
      getCotizaciones({variables: {email: dataUser?.namespaces?.profile.email.value, fechaInicial: moment(initDate).format('YYYY-MM-DD'), fechaFinal: moment(endDate).format('YYYY-MM-DD'), noParte: value}})
    }
  }

  const buscadorSelect = (value: string) => {
    if (buscarPor == 'cotizacion') {
      if (value == '')
        setCtz(cotizaciones)
      else
        setCtz(cotizaciones?.filter(({ cotizacion }) => cotizacion.toString().includes(value)) || null)
    } else if (buscarPor == 'parte') {
      setNoParte(value)
      searchCotizaciones(value)
    }
  }

  const borrarFiltroEstatus = () => {
    setCtz(cotizaciones)
    setBorrarFiltroCot(false)
    setBorrarFiltroFac(false)
    setBorrarFiltroPor(false)
  }

  const filtroEstatus = (filtro: string) => {
    if (filtro === 'Por Facturar') {
      setCtz(cotizaciones?.filter(({ Estatus }) => Estatus === filtro || Estatus === 'Pedido' || Estatus === 'Pedido, Por Facturar') || null)
    } else {
      setCtz(cotizaciones?.filter(({ Estatus }) => Estatus === filtro) || null)
    }
    switch (filtro) {
      case 'Cotizado':
        setBorrarFiltroCot(true)
        setBorrarFiltroFac(false)
        setBorrarFiltroPor(false)
        break
      case 'Facturado':
        setBorrarFiltroFac(true)
        setBorrarFiltroCot(false)
        setBorrarFiltroPor(false)
        break
      case 'Por Facturar':
        setBorrarFiltroPor(true)
        setBorrarFiltroCot(false)
        setBorrarFiltroFac(false)
        break
      default:
        break
    }
  }

  const openDatePicker = () => {
    setInitDate(moment().subtract(14, 'd').toDate())
    setEndDate(moment().toDate())
  }

  const clearBuscador = () => {
    if (buscarPor == 'cotizacion') {
        setCtz(cotizaciones)
    } else if (buscarPor == 'parte') {
      CotizacionStore.setAntCotizaciones()
    }
  }

  return (
    <>
      <PageHeader
        title='Mis cotizaciones'
        linkLabel='ATRÁS'
        onLinkClick={() => {
          window.location.hash = "#/profile"
        }}
      />
      <div className='dn flex-ns w-100 justify-around'>
        <div className='flex w-20'>
          <DatePicker
            ref={refDatePicker}
            label='Fecha Inicial'
            value={initDate}
            maxDate={dateNow}
            onChange={(e: Date) => {
              if (initDate !== e) setInitDate(e)
            }}
            locale='es'/>
        </div>
        <div className='flex w-20'>
          <DatePicker
            label='Fecha Final'
            value={endDate}
            maxDate={dateNow}
            onChange={(e: Date) => {
              if (endDate !== e) setEndDate(e)
            }}
            locale='es'/>
        </div>
        <div className='flex w-50'>
          <Dropdown
            label='Buscar Por'
            size='regular'
            options={[{ value: 'cotizacion', label: 'Número de Cotización' },{ value: 'parte', label: 'Número de Parte' },]}
            value={buscarPor}
            onChange={(_: any, value: string) => setBuscarPor(value)}/>
          <InputSearch
            label='Buscador'
            placeholder='Buscar'
            size='regular'
            value={buscador}
            onClear={clearBuscador}
            onChange={(e: any) => setBuscador(e.target.value)}
            onSubmit={(e: any) => {
              e.preventDefault()
              buscadorSelect(e.target.value)
            }}/>
        </div>
      </div>
      <div className='flex flex-row items-end mv3'>
        <button className='db dn-ns pv3 ph4 w-100 tc br1 b mr4' onClick={()=>setSearchByNum(true)}>Buscar</button>
        <button className='db dn-ns pv3 ph4 w-100 tc br1 b' onClick={()=>setOpenSearch(true)}>Filtrar</button>
        {openSearch &&
          <div className='absolute overflow-auto bg-white left-0 z-4 vh-100 vw-100 top-0 searchModal'>
            <div className='bg-yellow f3 flex items-center pa3 w-100 ' onClick={()=>setOpenSearch(false)}>
              <span className='pointer mr3'><svg width={24} height={24} fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9.57 5.93 3.5 12l6.07 6.07M20.5 12H3.67' stroke='#292D32' strokeWidth={1.5} strokeMiterlimit={10} strokeLinecap='round' strokeLinejoin='round' /></svg>
              </span>
              <span className='font-outfitA f5 '>Buscador de fechas</span>
            </div>
            <div className='ph4 pv4'>
              <div className='flex flex-row items-center flex-wrap justify-center w-100'>
                <div className='flex flex-column w-50'>
                  <DatePicker
                    label='Fecha Inicial'
                    value={initDate}
                    maxDate={dateNow}
                    onChange={(e: Date) => {
                      if (initDate !== e) setInitDate(e)
                    }}
                  locale='es'/>
                </div>
                <div className='flex flex-column w-50'>
                  <DatePicker
                    label='Fecha Final'
                    value={endDate}
                    maxDate={dateNow}
                    onChange={(e: Date) => {
                      if (endDate !== e) setEndDate(e)
                    }}
                    locale='es'/>
                </div>
                <div className='flex flex-column items-center justify-end w-100 mt3'>
                  <div className='bg-yellow br2 font-outfitA f3 flex items-center justify-center pa3 w-80 pointer' onClick={() => {searchCotizaciones(''); setOpenSearch(false)}}>Filtrar</div>
                </div>
              </div>
            </div>
          </div>
        }
        {searchbyNum &&
          <div className='absolute overflow-auto bg-white left-0 z-4 vh-100 vw-100 top-0 searchModal'>
            <div className='bg-yellow f3 flex items-center pa3 w-100 ' onClick={()=>setSearchByNum(false)}>
              <span className='pointer mr3'><svg width={24} height={24} fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9.57 5.93 3.5 12l6.07 6.07M20.5 12H3.67' stroke='#292D32' strokeWidth={1.5} strokeMiterlimit={10} strokeLinecap='round' strokeLinejoin='round' /></svg>
              </span>
              <span className='font-outfitA f5 '>Buscador de Cotizaciones</span>
            </div>
            <div className='ph6 pv4 mv3'>
              <span className='font-outfitA mv4 f5'>Encontrar tu cotización ahora es más fácil, busca por número de parte o por numero de cotización</span>
              <div className='flex flex-row justify-center w-100 flex-wrap'>
                <div className='flex flex-column w-100'>
                  <span className='flex items-center mv2'><svg className='w-10' width={24} height={24} fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM12 8v5' stroke='#292D32' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M11.995 16h.009' stroke='#292D32' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' /></svg><span className='font-outfitA ml2'>Ingresa el número de parte y encuentra las facturas que contengan dicho número de parte</span></span>
                  <div className='relative dib'>
                    <Dropdown
                      label='Buscar Por'
                      size='regular'
                      options={[{ value: 'cotizacion', label: 'Número de Cotización' },{ value: 'parte', label: 'Número de Parte' },]}
                      value={buscarPor}
                      onChange={(_: any, value: string) => setBuscarPor(value)}/>
                  </div>
                </div>
                <div className='flex flex-column w-100'>
                  <span className='flex items-center mv2' ><svg className='w-10' width={24} height={24} fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM12 8v5' stroke='#292D32' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M11.995 16h.009' stroke='#292D32' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' /></svg><span className='font-outfitA ml2'>Ingresa el número de cotización de 6 digitos, no incluyas la sucursal</span></span>
                  <div className='relative dib'>
                    <InputSearch
                      label='Buscador'
                      placeholder='Buscar'
                      size='regular'
                      value={buscador}
                      onChange={(e: any) => setBuscador(e.target.value)}
                      onSubmit={(e: any) => {
                        e.preventDefault()
                        buscadorSelect(e.target.value)
                      }}/>
                  </div>
                </div>
                <div className='bg-yellow mv3 br2 font-outfitA f3 flex items-center justify-center pa3 w-80 pointer' onClick={()=>{setSearchByNum(false); buscadorSelect(buscador)}}>Buscar</div>
              </div>
            </div>
          </div>
        }
      </div>
      <div className='flex flex-row justify-around items-center mv4'>
        <div className='flex flex-row justify-center w-30'>
          <div className='flex flex-row justify-around bg-washed-yellow w-70 br3 pa6 pointer' onClick={() => filtroEstatus('Cotizado')}>
            <div className='dn db-ns pa3 f3 br2 bg-yellow'>
              <svg width={32} height={32} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 8.25V18c0 3-1.79 4-4 4H8c-2.21 0-4-1-4-4V8.25c0-3.25 1.79-4 4-4 0 .62.25 1.18.66 1.59.41.41.97.66 1.59.66h3.5C14.99 6.5 16 5.49 16 4.25c2.21 0 4 .75 4 4Z' stroke='#FFF' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M16 4.25c0 1.24-1.01 2.25-2.25 2.25h-3.5c-.62 0-1.18-.25-1.59-.66C8.25 5.43 8 4.87 8 4.25 8 3.01 9.01 2 10.25 2h3.5c.62 0 1.18.25 1.59.66.41.41.66.97.66 1.59ZM8 13h4M8 17h8' stroke='#FFF' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /></svg>
            </div>
            <div className='flex flex-column justify-center items-center f6'>
              <div>Cotizadas</div>
              <div className='f2 b mt2'>{cotizadas}</div>
            </div>
          </div>
          <div className='flex flex-row pointer'><svg onClick={borrarFiltroEstatus} className={!borrarFiltroCot ? 'dn' : ''} width={32} height={32} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M13.41 20.79 12 21.7c-1.31.81-3.13-.1-3.13-1.72v-5.35c0-.71-.4-1.62-.81-2.12L4.22 8.47c-.51-.51-.91-1.41-.91-2.02V4.13c0-1.21.91-2.12 2.02-2.12h13.34c1.11 0 2.02.91 2.02 2.02v2.22c0 .81-.51 1.82-1.01 2.32' stroke='#D12815' strokeWidth={1.5} strokeMiterlimit={10} strokeLinecap='round' strokeLinejoin='round' /><path d='M21.63 14.75c0 .89-.25 1.73-.69 2.45a4.709 4.709 0 0 1-4.06 2.3 4.73 4.73 0 0 1-4.06-2.3 4.66 4.66 0 0 1-.69-2.45c0-2.62 2.13-4.75 4.75-4.75s4.75 2.13 4.75 4.75ZM18.15 15.99l-2.51-2.51M18.13 13.51l-2.51 2.51' stroke='#D12815' strokeWidth={1.5} strokeMiterlimit={10} strokeLinecap='round' strokeLinejoin='round' /><path d='M20.69 4.02v2.22c0 .81-.51 1.82-1.01 2.33l-1.76 1.55a4.42 4.42 0 0 0-1.04-.12c-2.62 0-4.75 2.13-4.75 4.75 0 .89.25 1.73.69 2.45.37.62.88 1.15 1.5 1.53v.34c0 .61-.4 1.42-.91 1.72L12 21.7c-1.31.81-3.13-.1-3.13-1.72v-5.35c0-.71-.41-1.62-.81-2.12L4.22 8.47c-.5-.51-.91-1.42-.91-2.02V4.12C3.31 2.91 4.22 2 5.33 2h13.34c1.11 0 2.02.91 2.02 2.02Z' stroke='#D12815' strokeWidth={1.5} strokeMiterlimit={10} strokeLinecap='round' strokeLinejoin='round' /></svg></div>
        </div>
        <div className='flex flex-row justify-center w-30'>
          <div className='flex flex-row justify-around bg-washed-green w-70 br3 pa6 pointer' onClick={() => filtroEstatus('Facturado')}>
            <div className='dn db-ns pa3 f3 br2 bg-yellow'>
              <svg width={32} height={32} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M18.04 13.55c-.42.41-.66 1-.6 1.63.09 1.08 1.08 1.87 2.16 1.87h1.9v1.19c0 2.07-1.69 3.76-3.76 3.76H7.63c.31-.26.58-.58.79-.94.37-.6.58-1.31.58-2.06a3.999 3.999 0 0 0-6.5-3.12v-4.37c0-2.07 1.69-3.76 3.76-3.76h11.48c2.07 0 3.76 1.69 3.76 3.76v1.44h-2.02c-.56 0-1.07.22-1.44.6Z' stroke='#FFF' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M2.5 12.41V7.84c0-1.19.73-2.25 1.84-2.67l7.94-3a1.9 1.9 0 0 1 2.57 1.78v3.8M22.559 13.97v2.06c0 .55-.44 1-1 1.02h-1.96c-1.08 0-2.07-.79-2.16-1.87-.06-.63.18-1.22.6-1.63.37-.38.88-.6 1.44-.6h2.08c.56.02 1 .47 1 1.02ZM7 12h7' stroke='#FFF' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M9 19c0 .75-.21 1.46-.58 2.06-.21.36-.48.68-.79.94-.7.63-1.62 1-2.63 1a3.97 3.97 0 0 1-3.42-1.94A3.92 3.92 0 0 1 1 19c0-1.26.58-2.39 1.5-3.12A3.999 3.999 0 0 1 9 19Z' stroke='#FFF' strokeWidth={1.5} strokeMiterlimit={10} strokeLinecap='round' strokeLinejoin='round' /><path d='m3.441 19 .99.99 2.13-1.97' stroke='#FFF' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /></svg>
            </div>
            <div className='flex flex-column justify-center items-center f6'>
              <div>Facturadas</div>
              <div className='f2 b mt2'>{facturadas}</div>
            </div>
          </div>
          <div className='flex flex-row pointer'><svg onClick={borrarFiltroEstatus} className={!borrarFiltroFac ? 'dn' : ''} width={32} height={32} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M13.41 20.79 12 21.7c-1.31.81-3.13-.1-3.13-1.72v-5.35c0-.71-.4-1.62-.81-2.12L4.22 8.47c-.51-.51-.91-1.41-.91-2.02V4.13c0-1.21.91-2.12 2.02-2.12h13.34c1.11 0 2.02.91 2.02 2.02v2.22c0 .81-.51 1.82-1.01 2.32' stroke='#D12815' strokeWidth={1.5} strokeMiterlimit={10} strokeLinecap='round' strokeLinejoin='round' /><path d='M21.63 14.75c0 .89-.25 1.73-.69 2.45a4.709 4.709 0 0 1-4.06 2.3 4.73 4.73 0 0 1-4.06-2.3 4.66 4.66 0 0 1-.69-2.45c0-2.62 2.13-4.75 4.75-4.75s4.75 2.13 4.75 4.75ZM18.15 15.99l-2.51-2.51M18.13 13.51l-2.51 2.51' stroke='#D12815' strokeWidth={1.5} strokeMiterlimit={10} strokeLinecap='round' strokeLinejoin='round' /><path d='M20.69 4.02v2.22c0 .81-.51 1.82-1.01 2.33l-1.76 1.55a4.42 4.42 0 0 0-1.04-.12c-2.62 0-4.75 2.13-4.75 4.75 0 .89.25 1.73.69 2.45.37.62.88 1.15 1.5 1.53v.34c0 .61-.4 1.42-.91 1.72L12 21.7c-1.31.81-3.13-.1-3.13-1.72v-5.35c0-.71-.41-1.62-.81-2.12L4.22 8.47c-.5-.51-.91-1.42-.91-2.02V4.12C3.31 2.91 4.22 2 5.33 2h13.34c1.11 0 2.02.91 2.02 2.02Z' stroke='#D12815' strokeWidth={1.5} strokeMiterlimit={10} strokeLinecap='round' strokeLinejoin='round' /></svg></div>
        </div>
        <div className='flex flex-row justify-center w-30'>
          <div className='flex flex-row justify-around bg-washed-blue w-70 br3 pa5 pa6-ns pointer' onClick={() => filtroEstatus('Por Facturar')}>
            <div className='dn db-ns pa3 f3 br2 bg-yellow'>
              <svg width={32} height={32} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M18.04 13.55c-.42.41-.66 1-.6 1.63.09 1.08 1.08 1.87 2.16 1.87h1.9v1.19c0 2.07-1.69 3.76-3.76 3.76H7.64C8.47 21.27 9 20.2 9 19a3.999 3.999 0 0 0-6.5-3.12v-4.37c0-2.07 1.69-3.76 3.76-3.76h11.48c2.07 0 3.76 1.69 3.76 3.76v1.44h-2.02c-.56 0-1.07.22-1.44.6Z' stroke='#FFF' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M2.5 11.51V7.84c0-1.19.73-2.25 1.84-2.67l7.94-3c1.24-.46 2.57.45 2.57 1.78v3.8M22.559 13.97v2.06c0 .55-.44 1-1 1.02h-1.96c-1.08 0-2.07-.79-2.16-1.87-.06-.63.18-1.22.6-1.63.37-.38.88-.6 1.44-.6h2.08c.56.02 1 .47 1 1.02ZM7 12h7' stroke='#FFF' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M9 19c0 1.2-.53 2.27-1.36 3A4 4 0 0 1 5 23c-2.21 0-4-1.79-4-4 0-1.26.58-2.39 1.5-3.12A3.999 3.999 0 0 1 9 19Z' stroke='#FFF' strokeWidth={1.5} strokeMiterlimit={10} strokeLinecap='round' strokeLinejoin='round' /><path d='M5.25 17.75v1.5L4 20' stroke='#FFF' strokeWidth={1.5} strokeMiterlimit={10} strokeLinecap='round' strokeLinejoin='round' /></svg>
            </div>
            <div className='flex flex-column justify-center items-center f6'>
              <div className='tc'>Por Facturar</div>
              <div className='f2 b mt2'>{porFacturar}</div>
            </div>
          </div>
          <div className='flex flex-row pointer'><svg onClick={borrarFiltroEstatus} className={!borrarFiltroPor ? 'dn' : ''} width={32} height={32} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M13.41 20.79 12 21.7c-1.31.81-3.13-.1-3.13-1.72v-5.35c0-.71-.4-1.62-.81-2.12L4.22 8.47c-.51-.51-.91-1.41-.91-2.02V4.13c0-1.21.91-2.12 2.02-2.12h13.34c1.11 0 2.02.91 2.02 2.02v2.22c0 .81-.51 1.82-1.01 2.32' stroke='#D12815' strokeWidth={1.5} strokeMiterlimit={10} strokeLinecap='round' strokeLinejoin='round' /><path d='M21.63 14.75c0 .89-.25 1.73-.69 2.45a4.709 4.709 0 0 1-4.06 2.3 4.73 4.73 0 0 1-4.06-2.3 4.66 4.66 0 0 1-.69-2.45c0-2.62 2.13-4.75 4.75-4.75s4.75 2.13 4.75 4.75ZM18.15 15.99l-2.51-2.51M18.13 13.51l-2.51 2.51' stroke='#D12815' strokeWidth={1.5} strokeMiterlimit={10} strokeLinecap='round' strokeLinejoin='round' /><path d='M20.69 4.02v2.22c0 .81-.51 1.82-1.01 2.33l-1.76 1.55a4.42 4.42 0 0 0-1.04-.12c-2.62 0-4.75 2.13-4.75 4.75 0 .89.25 1.73.69 2.45.37.62.88 1.15 1.5 1.53v.34c0 .61-.4 1.42-.91 1.72L12 21.7c-1.31.81-3.13-.1-3.13-1.72v-5.35c0-.71-.41-1.62-.81-2.12L4.22 8.47c-.5-.51-.91-1.42-.91-2.02V4.12C3.31 2.91 4.22 2 5.33 2h13.34c1.11 0 2.02.91 2.02 2.02Z' stroke='#D12815' strokeWidth={1.5} strokeMiterlimit={10} strokeLinecap='round' strokeLinejoin='round' /></svg></div>
        </div>
      </div>
      <div className='flex flex-wrap mv3'>
        {loading && (
          <div className='flex flex-column items-center justify-center w-100'><Spinner /></div>
        )}
        {loading && <Loading />}
        {errorCotizaciones && ErrorMyAccount('Intenta reduciendo el rango de fechas', openDatePicker)}
        {(cotizaciones?.length === 0 && !loading) && (
          <h1 className='tc mt9 b w-100'>¡No tienes cotizaciones!</h1>
        )}
        {!!ctz?.length && !loading && !errorCotizaciones && ctz.map((dataItem) => {
          return (
            <CardCotizacion
              key={dataItem?.idCotizacion}
              fecha={dataItem?.fecha}
              cadecoQuoteId={dataItem?.cotizacion}
              link={
                dataItem?.idCotizacion
                  ? `/_secure/cotizador?quote=${dataItem?.idCotizacion}`
                  : ''
              }
              labellink='Ver detalle'
              dataItem={dataItem}
            />
          )
        })}
      </div>
    </>
  )
}

export default ListCotizaciones
