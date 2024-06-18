import { IntlShape, injectIntl } from 'react-intl'

type Render = (links: Link[]) => JSX.Element
type Link = {
  name: string
  path: string
}

const MyAppLink = ({ render }: { render: Render; intl: IntlShape }) => {

  return render([
    {
      name: 'Mis Cotizaciones',
      path: '/mis-cotizaciones',
    },
    {
      name: 'Mis Facturas',
      path: '/mis-facturas',
    },
    {
      name: 'Garantías',
      path: '/garantias',
    },
    {
      name: 'Notas de Crédito',
      path: '/mis-notas-credito',
    },
    {
      name: 'Complementos de Pago',
      path: '/complementos-pago',
    },
    {
      name: 'Mis Clientes',
      path: '/mis-clientes',
    },
    {
      name: 'Mi Crédito',
      path: '/mi-credito',
    },
    {
      name: "Mis Correos",
      path: "/mis-correos"
    },
  ])
}

export default injectIntl(MyAppLink)
