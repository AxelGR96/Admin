import React from 'react'
import { PageHeader } from 'vtex.styleguide'
import NotasCredito from './NotasCredito'

const ListNotasCredito = () => {
  return (
    <>
      <PageHeader
        title='Notas De Crédito'
        linkLabel='ATRÁS'
        onLinkClick={() => {
          window.location.hash = "#/profile"
        }}
      />
      <NotasCredito/>
    </>
  )
}

export default ListNotasCredito