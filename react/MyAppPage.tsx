import React, { Fragment } from 'react'
import { Route } from 'vtex.my-account-commons/Router'
import MisCotizaciones from './MisCotizaciones'
import MisFacturas from './MisFacturas'
import MisNotasCredito from './MisNotasCredito'
import ComplementosPago from './ComplementosPago'
import MiCredito from './MiCredito'
import Garantias from './Garantias'
import MisClientes from './MisClientes'
import MisUsuarios from './MisUsuarios'

const MyAppPage = () => (
	<Fragment>
		<Route path='/mis-cotizaciones' exact component={MisCotizaciones} />
		<Route path='/mis-facturas' exact component={MisFacturas} />
		<Route path='/garantias' exact component={Garantias} />
		<Route path='/mis-notas-credito' exact component={MisNotasCredito} />
		<Route path='/complementos-pago' exact component={ComplementosPago} />
		<Route path='/mis-clientes' exact component={MisClientes} />
		<Route path='/mi-credito' exact component={MiCredito} />
		<Route path='/mis-correos' exact component={MisUsuarios}/>
	</Fragment>
)

export default MyAppPage
