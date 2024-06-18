import React from 'react'
import { PageHeader } from 'vtex.styleguide'
import ComplementosPago from './ComplementosPago'

const ListComplementosPago = () => {
  return (
    <>
      <PageHeader
        title='Complementos de Pago'
        linkLabel='ATRÁS'
        onLinkClick={() => {
          window.location.hash = "#/profile"
        }}
      />
      <ComplementosPago/>
    </>
  )
}

export default ListComplementosPago