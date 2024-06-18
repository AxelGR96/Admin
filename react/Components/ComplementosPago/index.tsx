import React from 'react'
import { Spinner } from 'vtex.styleguide'
import Loading from '../Utils/Loading'
import ListComplementosPago from './ListComplementosPago'

const ComplementosPago = () => {
  const loading = false

  return(
    <>
      {loading && (
          <div className='flex flex-column items-center justify-center w-100'><Spinner /></div>
        )}
      {loading && <Loading />}
      {!loading && <ListComplementosPago/>}
    </>
  )
}

export default ComplementosPago
