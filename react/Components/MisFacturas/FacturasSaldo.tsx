import React, { useCallback, useEffect, useState } from 'react'
import { useRenderSession } from 'vtex.session-client'
import { Table, DatePicker, Button, Spinner } from 'vtex.styleguide'
import moment from 'moment'
import { utils, writeFile } from 'xlsx'
import getFacturasSaldoVtex  from '../../graphql/getFacturasSaldoVtex.graphql'
import useFacturaSaldoStore from '../Context/FacturasSaldoContext'
import Loading from '../Utils/Loading'
import ErrorMyAccount from '../Utils/ErrorMyAccount'
import FacturaSaldoType from '../Types/FacturaSaldoType'
import { useLazyQuery } from 'react-apollo'

const FacturasSaldo = () => {
  const FacturaSaldoStore = useFacturaSaldoStore()
  const listFacturas = FacturaSaldoStore.facturasSaldo
  const loading = FacturaSaldoStore.loading
  const errorFactura = FacturaSaldoStore.error
  const dataUser: any = useRenderSession().session || null
  const [getFacturasVtex, facturasVtex] = useLazyQuery(getFacturasSaldoVtex)
  const dateNow = moment().toDate()
  const [initDate, setInitDate] = useState(moment().subtract(14, 'd').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())
  const tableFacturas: any[] = []
  listFacturas?.map((fac: FacturaSaldoType) => tableFacturas.push({
    idf: fac.id,
    factura: fac.folio,
    fechaFactura: new Date(fac.fechaFactura).toLocaleDateString(),
    fechaVencimiento: new Date(fac.fechaVencimiento).toLocaleDateString(),
    sucursal: `${fac.sucursal.id}-${fac.sucursal.descripcion}`,
    cliente: `${fac.cliente.id}-${fac.cliente.descripcion}`,
    total: `$${parseFloat(`${fac.total}`).toFixed(2)}`,
    saldo: `$${parseFloat(`${fac.saldo}`).toFixed(2)}`,
    moneda: fac.moneda,
    pdf: fac.comprobanteFiscal.urlPDF,
    xml: fac.comprobanteFiscal.urlXML,
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
      factura: {
        title: 'Factura',
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
      fechaFactura: {
        title: 'Fecha Factura',
        width: 105,
      },
      fechaVencimiento: {
        title: 'Fecha Vencimiento',
        width: 140,
      },
      sucursal: {
        title: 'Sucursal',
        width: 160,
      },
      cliente: {
        title: 'Cliente',
        width: 250,
      },
      total: {
        title: 'Total',
        width: 100,
      },
      saldo: {
        title: 'Saldo',
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
    slicedData: tableFacturas.slice(0, 5),
    currentItemFrom: 1,
    currentItemTo: 5,
    itemsLength: tableFacturas.length,
  })
  const [searchTable, setSearchTable] = useState('')

  useEffect(() => {
    document.title = 'Mis Facturas | Cadeco'
    if(dataUser != null)
      getFacturasVtex({variables: {email: dataUser?.namespaces?.profile.email.value, fechaInicio: moment(initDate).format('YYYY-MM-DD'), fechaFin: moment(endDate).format('YYYY-MM-DD')}})
      //FacturaSaldoStore.setFacturasSaldo(dataUser?.namespaces?.profile.email.value, moment(initDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'))
  }, [dataUser?.namespaces?.profile.email.value])

  useEffect(() => {
    if(listFacturas != null) {
      const newTableFacturas: any[] = []
      listFacturas?.map((fac: FacturaSaldoType) => newTableFacturas.push({
        idf: fac.id,
        factura: fac.folio,
        fechaFactura: new Date(fac.fechaFactura).toLocaleDateString(),
        fechaVencimiento: new Date(fac.fechaVencimiento).toLocaleDateString(),
        sucursal: `${fac.sucursal.id}-${fac.sucursal.descripcion}`,
        cliente: `${fac.cliente.id}-${fac.cliente.descripcion}`,
        total: `$${parseFloat(`${fac.total}`).toFixed(2)}`,
        saldo: `$${parseFloat(`${fac.saldo}`).toFixed(2)}`,
        moneda: fac.moneda,
        pdf: fac.comprobanteFiscal.urlPDF,
        xml: fac.comprobanteFiscal.urlXML,
      }))
      setInfoTabla({
        tableLength: 5,
        currentPage: 1,
        slicedData: newTableFacturas.slice(0, 5),
        currentItemFrom: 1,
        currentItemTo: 5,
        itemsLength: newTableFacturas.length,
      })
    }
  }, [listFacturas])

  useEffect(() => {
    if (!!facturasVtex.data)
      FacturaSaldoStore.setFacturaSaldoVtex(facturasVtex.data.facturasSaldos)
    if(!!facturasVtex.error)
      FacturaSaldoStore.setError(true)
    FacturaSaldoStore.setLoading(facturasVtex.loading)
  }, [facturasVtex])

  const buscarFecha = () => {
    getFacturasVtex({variables: {email: dataUser?.namespaces?.profile.email.value, fechaInicio: moment(initDate).format('YYYY-MM-DD'), fechaFin: moment(endDate).format('YYYY-MM-DD')}})
    //FacturaSaldoStore.setFacturasSaldo(dataUser?.namespaces?.profile.email.value, moment(initDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'))
  }

  const onChangeSearchTable = (e: any) => {
    setSearchTable(e.target.value)
  }

  const onClearSearchTable = (_: any) => {
    setSearchTable('')
    setInfoTabla({
      tableLength: 5,
      currentPage: 1,
      slicedData: tableFacturas.slice(0, 5),
      currentItemFrom: 1,
      currentItemTo: 5,
      itemsLength: tableFacturas.length,
    })
  }

  const onSearchTable = (e: any) => {
    const value = e && e.target && e.target.value
    const regex = new RegExp(value, 'i')
    if(!!value) {
      const searchData = tableFacturas.filter(fac => regex.test(fac.factura) || regex.test(fac.cliente) || regex.test(fac.sucursal) || regex.test(fac.total) || regex.test(fac.moneda))
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
    const data = tableFacturas.slice(itemFrom -1, itemTo)
    goToPage(infoTabla.tableLength, newPage, itemFrom, itemTo, data)
  }

  const onPrevPage = () => {
    if (infoTabla.currentPage == 0) return
    const newPage = infoTabla.currentPage - 1
    const itemFrom = infoTabla.currentItemFrom - infoTabla.tableLength
    const itemTo = infoTabla.currentItemFrom - 1
    const data = tableFacturas.slice(itemFrom - 1, itemTo)
    goToPage(infoTabla.tableLength, newPage, itemFrom, itemTo, data)
  }

  const onRowsChange = (_: any, value: string) => {
    setInfoTabla({
      tableLength: +value,
      currentPage: 1,
      slicedData: tableFacturas.slice(0, +value),
      currentItemFrom: 1,
      currentItemTo: +value,
      itemsLength: tableFacturas.length
    })
  }

  const goToPage = (tableLength: number, currentPage: number, currentItemFrom: number, currentItemTo: number, slicedData: any) => {
    setInfoTabla({
      tableLength,
      currentPage,
      slicedData,
      currentItemFrom,
      currentItemTo,
      itemsLength: tableFacturas.length,
    })
  }

  const exportFile = useCallback(() => {
    const ws = utils.json_to_sheet(tableFacturas)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, "Data")
    utils.sheet_add_aoa(ws, [['Factura','Fecha Factura','Fecha Vencimiento','Sucursal','Cliente','Total','Saldo','Moneda','PDF','XML']], {origin: "A1"})
    writeFile(wb, "FacturasConSaldo.xlsx")
  }, [tableFacturas])

  const facturasZip = (rows:any) => {
    const idZip: any[] = []
    if(rows.hasOwnProperty('allLinesSelected')){
      listFacturas?.map((fac:any) => {
        idZip.push({id: fac.id, descripcion:''})
      })
    } else {
      rows.selectedRows.map((row:any) => {
        idZip.push({id: row.idf, descripcion:''})
      })
    }
    FacturaSaldoStore.zipFacturasSaldo(JSON.stringify(idZip))
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
      {errorFactura && ErrorMyAccount('Intenta reduciendo el rango de fechas', () => {})}
      {!loading && !errorFactura &&
        <Table
        fullWidth
        schema={jsonschema} 
        items={infoTabla.slicedData}
        emptyStateLabel={'Sin datos...'}
        toolbar={{
          inputSearch: {
            value: searchTable,
            placeholder: 'Buscar factura...',
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
            handleCallback: facturasZip,
          },
        }}
      />
      }
    </div>
  )
}

export default FacturasSaldo