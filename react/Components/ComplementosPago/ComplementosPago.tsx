import React, { useCallback, useEffect, useState } from 'react'
import { useRenderSession } from 'vtex.session-client'
import { Table, DatePicker, Button, Spinner } from 'vtex.styleguide'
import moment from 'moment'
import { utils, writeFile } from 'xlsx';
import useComplementoPagoStore from '../Context/ComplementosPagoContext';
import getComprobantesPagoVtex from '../../graphql/getComprobantesPagoVtex.graphql'
import { useLazyQuery } from 'react-apollo'
import Loading from '../Utils/Loading';
import ErrorMyAccount from '../Utils/ErrorMyAccount';
import ComplementoPagoType from '../Types/ComplementoPagoType';


const ComplementosPago = () => {
  const ComplementoPagoStore = useComplementoPagoStore()
  const listComplementosPago = ComplementoPagoStore.complementosPago
  const loading = ComplementoPagoStore.loading
  const errorComplementoPago = ComplementoPagoStore.error
  const dataUser: any = useRenderSession().session || null
  const [getComprobantesPago, complementosPago] = useLazyQuery(getComprobantesPagoVtex)
  const dateNow = moment().toDate()
  const [initDate, setInitDate] = useState(moment().subtract(14, 'd').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())
  const tableComplementosPago: any[] = []
  listComplementosPago?.map((complemento: ComplementoPagoType) => tableComplementosPago.push({
    idf: complemento.id,
    complemento: complemento.folio,
    fecha: new Date(complemento.fechaComprobante).toLocaleDateString(),
    //sucursal: `${complemento.sucursal.id}-${complemento.sucursal.descripcion}`,
    cliente: `${complemento.cliente.id}-${complemento.cliente.descripcion}`,
    total: `$${parseFloat(`${complemento.total}`).toFixed(2)}`,
    moneda: complemento.moneda,
    estatus: complemento.estatus,
    usuario: `${complemento.usuario.idUsuarioReg}-${complemento.usuario.nombre}`,
    pdf: complemento.comprobanteFiscal.urlPDF,
    xml: complemento.comprobanteFiscal.urlXML,
    recibo: complemento.urlFolioRecibo,
  }))
  const jsonschema = {
    properties: {
      idf: {
        title: ' ',
        width: 1,
        cellRenderer: (data: any) => {
          return (
            <div className='dn'>{data.cellData}</div>
          )
        }
      },
      complemento: {
        title: 'Complemento',
        width: 100,
      },
      pdf: {
        title: 'PDF',
        width: 50,
        cellRenderer: (data: any) => {
          return (
            data.cellData != '' ? <a href={data.cellData} target='_blank' rel='noopener noreferrer'><svg width={24} height={24} fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 11v6l2-2M9 17l-2-2' stroke='#000' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5' stroke='#000' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M22 10h-4c-3 0-4-1-4-4V2l8 8Z' stroke='#000' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /></svg></a>
            : null
          )
        }
      },
      xml: {
        title: 'XML',
        width: 50,
        cellRenderer: (data: any) => {
          return (
            data.cellData != '' ? <a href={data.cellData} target='_blank' rel='noopener noreferrer'><svg width={24} height={24} fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 11v6l2-2M9 17l-2-2' stroke='#000' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5' stroke='#000' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /><path d='M22 10h-4c-3 0-4-1-4-4V2l8 8Z' stroke='#000' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' /></svg></a>
            : null
          )
        }
      },
      recibo: {
        title: 'Recibo',
        width: 60,
        cellRenderer: (data: any) => {
          return (
            data.cellData != '' ? <a href={data.cellData} target='_blank' rel='noopener noreferrer'><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none"><path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.73 19.7c.82-.88 2.07-.81 2.79.15l1.01 1.35c.81 1.07 2.12 1.07 2.93 0l1.01-1.35c.72-.96 1.97-1.03 2.79-.15 1.78 1.9 3.23 1.27 3.23-1.39V7.04C20.5 3.01 19.56 2 15.78 2H8.22C4.44 2 3.5 3.01 3.5 7.04V18.3c0 2.67 1.46 3.29 3.23 1.4Z" /><path stroke="#292D32" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.096 11h.01" /><path stroke="#292D32" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.898 11h5.5" /><path stroke="#292D32" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.096 7h.01" /><path stroke="#292D32" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.898 7h5.5" /></svg></a>
            : null
          )
        }
      },
      fecha: {
        title: 'Fecha',
        width: 105,
      },
      cliente: {
        title: 'Cliente',
      },
      usuario: {
        title: 'Usuario',
      },
      estatus: {
        title: 'Estatus',
        width: 100,
      },
      total: {
        title: 'Total',
        width: 100,
      },
      moneda: {
        title: 'Moneda',
        width: 75,
      },
    },
  }
  const [infoTabla, setInfoTabla] = useState({
    tableLength: 5,
    currentPage: 1,
    slicedData: tableComplementosPago.slice(0, 5),
    currentItemFrom: 1,
    currentItemTo: 5,
    itemsLength: tableComplementosPago.length,
  })
  const [searchTable, setSearchTable] = useState('')

  useEffect(() => {
    document.title = 'Complementos de Pago | Cadeco'
    if(dataUser != null)
      getComprobantesPago({variables: {email: dataUser?.namespaces?.profile.email.value, fechaInicio: moment(initDate).format('YYYY-MM-DD'), fechaFin: moment(endDate).format('YYYY-MM-DD')}})
      //ComplementoPagoStore.setComplementosPago(dataUser?.namespaces?.profile.email.value, moment(initDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'))
  }, [dataUser?.namespaces?.profile.email.value])

  useEffect(() => {
    if(listComplementosPago != null) {
      const newTaComplementosPago: any[] = []
      listComplementosPago?.map((complemento: ComplementoPagoType) => newTaComplementosPago.push({
        idf: complemento.id,
        complemento: complemento.folio,
        fecha: new Date(complemento.fechaComprobante).toLocaleDateString(),
        //sucursal: `${complemento.sucursal.id}-${complemento.sucursal.descripcion}`,
        cliente: `${complemento.cliente.id}-${complemento.cliente.descripcion}`,
        total: `$${parseFloat(`${complemento.total}`).toFixed(2)}`,
        moneda: complemento.moneda,
        estatus: complemento.estatus,
        usuario: `${complemento.usuario.idUsuarioReg}-${complemento.usuario.nombre}`,
        pdf: complemento.comprobanteFiscal.urlPDF,
        xml: complemento.comprobanteFiscal.urlXML,
        recibo: complemento.urlFolioRecibo,
      }))
      setInfoTabla({
        tableLength: 5,
        currentPage: 1,
        slicedData: newTaComplementosPago.slice(0, 5),
        currentItemFrom: 1,
        currentItemTo: 5,
        itemsLength: newTaComplementosPago.length,
      })
    }
  }, [listComplementosPago])

  useEffect(() => {
      if(!!complementosPago.data)
        ComplementoPagoStore.setComplementosPagoVtex(complementosPago.data.comprobantePagosVtex)
      if(!!complementosPago.error)
        ComplementoPagoStore.setError(true)
      ComplementoPagoStore.setLoading(complementosPago.loading)
  },[complementosPago])


  const buscarFecha = () => {
    getComprobantesPago({variables: {email: dataUser?.namespaces?.profile.email.value, fechaInicio: moment(initDate).format('YYYY-MM-DD'), fechaFin: moment(endDate).format('YYYY-MM-DD')}})
    //ComplementoPagoStore.setComplementosPago(dataUser?.namespaces?.profile.email.value, moment(initDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'))
  }

  const onChangeSearchTable = (e: any) => {
    setSearchTable(e.target.value)
  }

  const onClearSearchTable = (_: any) => {
    setSearchTable('')
    setInfoTabla({
      tableLength: 5,
      currentPage: 1,
      slicedData: tableComplementosPago.slice(0, 5),
      currentItemFrom: 1,
      currentItemTo: 5,
      itemsLength: tableComplementosPago.length,
    })
  }

  const onSearchTable = (e: any) => {
    const value = e && e.target && e.target.value
    const regex = new RegExp(value, 'i')
    if(!!value) {
      const searchData = tableComplementosPago.filter(complemento => regex.test(complemento.complemento) || regex.test(complemento.cliente) || regex.test(complemento.total))
      setInfoTabla({
        tableLength: 5,
        currentPage: 1,
        slicedData: searchData.slice(0, 5),
        currentItemFrom: 1,
        currentItemTo: 5,
        itemsLength: searchData.length,
      })
    }
  }

  const onNextPage = () => {
    const newPage = infoTabla.currentPage + 1
    const itemFrom = infoTabla.currentItemTo + 1
    const itemTo = infoTabla.tableLength * newPage
    const data = tableComplementosPago.slice(itemFrom -1, itemTo)
    goToPage(infoTabla.tableLength, newPage, itemFrom, itemTo, data)
  }

  const onPrevPage = () => {
    if (infoTabla.currentPage == 0) return
    const newPage = infoTabla.currentPage - 1
    const itemFrom = infoTabla.currentItemFrom - infoTabla.tableLength
    const itemTo = infoTabla.currentItemFrom - 1
    const data = tableComplementosPago.slice(itemFrom - 1, itemTo)
    goToPage(infoTabla.tableLength, newPage, itemFrom, itemTo, data)
  }

  const onRowsChange = (_: any, value: string) => {
    setInfoTabla({
      tableLength: +value,
      currentPage: 1,
      slicedData: tableComplementosPago.slice(0, +value),
      currentItemFrom: 1,
      currentItemTo: +value,
      itemsLength: tableComplementosPago.length
    })
  }

  const goToPage = (tableLength: number, currentPage: number, currentItemFrom: number, currentItemTo: number, slicedData: any) => {
    setInfoTabla({
      tableLength,
      currentPage,
      slicedData,
      currentItemFrom,
      currentItemTo,
      itemsLength: tableComplementosPago.length,
    })
  }

  const exportFile = useCallback(() => {
    const ws = utils.json_to_sheet(tableComplementosPago);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    utils.sheet_add_aoa(ws, [['Nota de Credito','Fecha','Sucursal','Cliente','Total','Moneda','PDF','XML']], {origin: "A1"})
    writeFile(wb, "NotasDeCredito.xlsx");
  }, [tableComplementosPago]);

  const complementosPagoZip = (rows:any) => {
    const idZip: any[] = []
    if(rows.hasOwnProperty('allLinesSelected')){
      listComplementosPago?.map((complemento:any) => {
        idZip.push({id: complemento.id, descripcion:''})
      })
    } else {
      rows.selectedRows.map((row:any) => {
        idZip.push({id: row.idf, descripcion:''})
      })
    }
    ComplementoPagoStore.zipComplementosPago(JSON.stringify(idZip))
  }

  return(
    <div className='flex flex-column ph5 w-100 mt5'>
      <div className='flex flex-row w-100 justify-around mb6'>
        <div className='flex w-20'>
          <DatePicker
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
        <div className='flex w-20 items-end'>
          <Button onClick={buscarFecha}>
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none"><path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2" /></svg>
          </Button>
        </div>
      </div>
      {loading && (
        <div className='flex flex-column items-center justify-center w-100'><Spinner /></div>
      )}
      {loading && <Loading />}
      {errorComplementoPago && ErrorMyAccount('Intenta reduciendo el rango de fechas', () => {})}
      {!loading && !errorComplementoPago &&
        <Table
        fullWidth
        schema={jsonschema} 
        items={infoTabla.slicedData}
        emptyStateLabel={'Sin datos...'}
        toolbar={{
          inputSearch: {
            value: searchTable,
            placeholder: 'Buscar complemento de pago...',
            onChange: onChangeSearchTable,
            onClear: onClearSearchTable,
            onSubmit: onSearchTable,
          },
          download: {
            label: 'Exportar Excel',
            handleCallback: exportFile,
          },
        }}
        pagination={{
          onNextClick: onNextPage,
          onPrevClick: onPrevPage,
          currentItemFrom: infoTabla.currentItemFrom,
          currentItemTo: infoTabla.currentItemTo,
          onRowsChange: onRowsChange,
          textShowRows: 'Filas',
          textOf: 'de',
          totalItems: infoTabla.itemsLength,
          rowsOptions: [5, 10, 15, 25],
        }}
        bulkActions={{
          texts: {
            rowsSelected: (row: string) => (
              <>Filas seleccionadas: {row}</>
            ),
            selectAll: 'Seleccionar todo',
            allRowsSelected: (row: string) => (
              <>Filas seleccionadas: {row}</>
            ),
          },
          totalItems: infoTabla.itemsLength,
          main: {
            label: 'Descargar zip',
            handleCallback: complementosPagoZip,
          },
        }}
      />
      }
    </div>
  )
}

export default ComplementosPago