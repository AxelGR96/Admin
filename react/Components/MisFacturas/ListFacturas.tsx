import React, { useState } from 'react'
import { PageHeader, Tabs, Tab } from 'vtex.styleguide'
import FacturasSaldo from './FacturasSaldo'
import FacturasPagadas from './FacturasPagadas'

const ListFacturas = () => {
  const [pageTab, setPageTab] = useState(1)

  return (
    <>
      <PageHeader
        title='Mis facturas'
        linkLabel='ATRÁS'
        onLinkClick={() => {
          window.location.hash = "#/profile"
        }}
      />
      <Tabs fullWidth>
        <Tab
          label="Facturas con saldo"
          active={pageTab === 1}
          onClick={() => setPageTab(1)}>
          <FacturasSaldo/>
        </Tab>
        <Tab
          label="Facturas pagadas"
          active={pageTab === 2}
          onClick={() => setPageTab(2)}>
          <FacturasPagadas/>
        </Tab>
      </Tabs>
    </>
  )
}

export default ListFacturas