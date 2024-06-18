import React, { useCallback, useEffect, useState } from 'react'
import { useRenderSession } from 'vtex.session-client'
import { Table, DatePicker, Button, Spinner } from 'vtex.styleguide'
import moment from 'moment'
import { utils, writeFile } from 'xlsx';
import getNotasCreditoVtex from '../../graphql/getNotasCreditoVtex.graphql'
import { useLazyQuery } from 'react-apollo'
import useNotaCreditoStore from '../Context/NotasCreditoContext';
import Loading from '../Utils/Loading';
import ErrorMyAccount from '../Utils/ErrorMyAccount';
import NotaCreditoType from '../Types/NotaCreditoType';

const NotasCredito = () => {
  const NotaCreditoStore = useNotaCreditoStore()
  const listNotasCredito = NotaCreditoStore.notasCredito
  const loading = NotaCreditoStore.loading
  const errorNotaCredito = NotaCreditoStore.error
  const dataUser: any = useRenderSession().session || null
  const [getNotasCredito, notasCredito] = useLazyQuery(getNotasCreditoVtex)
  const dateNow = moment().toDate()
  const [initDate, setInitDate] = useState(moment().subtract(14, 'd').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())
  const tableNotasCredito: any[] = []
  listNotasCredito?.map((nota: NotaCreditoType) => tableNotasCredito.push({
    idf: nota.id,
    nota: nota.folio,
    fecha: new Date(nota.fecha).toLocaleDateString(),
    sucursal: `${nota.sucursal.id}-${nota.sucursal.descripcion}`,
    cliente: `${nota.cliente.id}-${nota.cliente.descripcion}`,
    total: `$${parseFloat(`${nota.total}`).toFixed(2)}`,
    moneda: nota.moneda.abrev,
    pdf: nota.comprobanteFiscal.urlPDF,
    xml: nota.comprobanteFiscal.urlXML,
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
      nota: {
        title: 'Nota de Credito',
        width: 130,
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
      fecha: {
        title: 'Fecha',
        width: 105,
      },
      sucursal: {
        title: 'Sucursal',
      },
      cliente: {
        title: 'Cliente',
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
    slicedData: tableNotasCredito.slice(0, 5),
    currentItemFrom: 1,
    currentItemTo: 5,
    itemsLength: tableNotasCredito.length,
  })
  const [searchTable, setSearchTable] = useState('')

  useEffect(() => {
    document.title = 'Mis Notas de Credito | Cadeco'
    if(dataUser != null)
      getNotasCredito({variables: {email: dataUser?.namespaces?.profile.email.value, fechaInicio: moment(initDate).format('YYYY-MM-DD'), fechaFin: moment(endDate).format('YYYY-MM-DD')}})
      //NotaCreditoStore.setNotasCredito(dataUser?.namespaces?.profile.email.value, moment(initDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'))
  }, [dataUser?.namespaces?.profile.email.value])

  useEffect(() => {
    if(listNotasCredito != null) {
      const newTaNotasCredito: any[] = []
      listNotasCredito?.map((nota: NotaCreditoType) => newTaNotasCredito.push({
        idf: nota.id,
        nota: nota.folio,
        fecha: new Date(nota.fecha).toLocaleDateString(),
        sucursal: `${nota.sucursal.id}-${nota.sucursal.descripcion}`,
        cliente: `${nota.cliente.id}-${nota.cliente.descripcion}`,
        total: `$${parseFloat(`${nota.total}`).toFixed(2)}`,
        moneda: nota.moneda.abrev,
        pdf: nota.comprobanteFiscal.urlPDF,
        xml: nota.comprobanteFiscal.urlXML,
      }))
      setInfoTabla({
        tableLength: 5,
        currentPage: 1,
        slicedData: newTaNotasCredito.slice(0, 5),
        currentItemFrom: 1,
        currentItemTo: 5,
        itemsLength: newTaNotasCredito.length,
      })
    }
  }, [listNotasCredito])

  useEffect(() => {
    if(!!notasCredito.data)
      NotaCreditoStore.setNotasCreditoVtex(notasCredito.data.notasCredito)
    if(!!notasCredito.error)
      NotaCreditoStore.setError(true)
    NotaCreditoStore.setLoading(notasCredito.loading)
  },[notasCredito])

  const buscarFecha = () => {
    getNotasCredito({variables: {email: dataUser?.namespaces?.profile.email.value, fechaInicio: moment(initDate).format('YYYY-MM-DD'), fechaFin: moment(endDate).format('YYYY-MM-DD')}})
    //NotaCreditoStore.setNotasCredito(dataUser?.namespaces?.profile.email.value, moment(initDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'))  
  }

  const onChangeSearchTable = (e: any) => {
    setSearchTable(e.target.value)
  }

  const onClearSearchTable = (_: any) => {
    setSearchTable('')
    setInfoTabla({
      tableLength: 5,
      currentPage: 1,
      slicedData: tableNotasCredito.slice(0, 5),
      currentItemFrom: 1,
      currentItemTo: 5,
      itemsLength: tableNotasCredito.length,
    })
  }

  const onSearchTable = (e: any) => {
    const value = e && e.target && e.target.value
    const regex = new RegExp(value, 'i')
    if(!!value) {
      const searchData = tableNotasCredito.filter(nota => regex.test(nota.nota) || regex.test(nota.cliente) || regex.test(nota.sucursal) || regex.test(nota.total))
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
    const data = tableNotasCredito.slice(itemFrom -1, itemTo)
    goToPage(infoTabla.tableLength, newPage, itemFrom, itemTo, data)
  }

  const onPrevPage = () => {
    if (infoTabla.currentPage == 0) return
    const newPage = infoTabla.currentPage - 1
    const itemFrom = infoTabla.currentItemFrom - infoTabla.tableLength
    const itemTo = infoTabla.currentItemFrom - 1
    const data = tableNotasCredito.slice(itemFrom - 1, itemTo)
    goToPage(infoTabla.tableLength, newPage, itemFrom, itemTo, data)
  }

  const onRowsChange = (_: any, value: string) => {
    setInfoTabla({
      tableLength: +value,
      currentPage: 1,
      slicedData: tableNotasCredito.slice(0, +value),
      currentItemFrom: 1,
      currentItemTo: +value,
      itemsLength: tableNotasCredito.length
    })
  }

  const goToPage = (tableLength: number, currentPage: number, currentItemFrom: number, currentItemTo: number, slicedData: any) => {
    setInfoTabla({
      tableLength,
      currentPage,
      slicedData,
      currentItemFrom,
      currentItemTo,
      itemsLength: tableNotasCredito.length,
    })
  }

  const exportFile = useCallback(() => {
    const ws = utils.json_to_sheet(tableNotasCredito);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    utils.sheet_add_aoa(ws, [['Nota de Credito','Fecha','Sucursal','Cliente','Total','Moneda','PDF','XML']], {origin: "A1"})
    writeFile(wb, "NotasDeCredito.xlsx");
  }, [tableNotasCredito]);

  const notasCreditoZip = (rows:any) => {
    const idZip: any[] = []
    if(rows.hasOwnProperty('allLinesSelected')){
      listNotasCredito?.map((nota:any) => {
        idZip.push({id: nota.id, descripcion:''})
      })
    } else {
      rows.selectedRows.map((row:any) => {
        idZip.push({id: row.idf, descripcion:''})
      })
    }
    NotaCreditoStore.zipNotasCredito(JSON.stringify(idZip))
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
      {errorNotaCredito && ErrorMyAccount('Intenta reduciendo el rango de fechas', () => {})}
      {!loading && !errorNotaCredito &&
        <Table
        fullWidth
        schema={jsonschema} 
        items={infoTabla.slicedData}
        emptyStateLabel={'Sin datos...'}
        toolbar={{
          inputSearch: {
            value: searchTable,
            placeholder: 'Buscar nota de credito...',
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
            handleCallback: notasCreditoZip,
          },
        }}
      />
      }
    </div>
  )
}

export default NotasCredito