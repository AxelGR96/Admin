export default interface ListCotizacionesType {
  idCotizacion: number;
  cotizacion: number;
  fecha: string;
  sucursal: number;
  Cliente: Cliente;
  ordenCompra: string;
  nombreReceptor: string;
  noEconomico: string;
  noRequisicion: string;
  subtotal: number;
  Moneda: string;
  facturas: Factura[];
  Estatus: string;
}

interface Factura {
  folio: string;
  fecha: string;
  comprobanteFiscal: ComprobanteFiscal;
}

interface ComprobanteFiscal {
  urlPDF: string;
  urlXML: string;
}

interface Cliente {
  idCliente: number;
  nombre: string;
}