export default interface NotaCreditoType {
  id: number;
  folio: string;
  fecha: string;
  total: number;
  tipo: Tipo;
  cliente: Tipo;
  sucursal: Tipo;
  moneda: Moneda;
  comprobanteFiscal: ComprobanteFiscal;
  factura: Factura;
}

interface Factura {
  id: number;
  serie: string;
  folio: string;
  fechaFactura: string;
  fechaVencimiento: string;
  fechaLimiteGarantia: string;
  total: number;
  saldo: number;
  cliente: Cliente;
  sucursal: Tipo;
  moneda: Moneda;
  comprobanteFiscal: ComprobanteFiscal;
}

interface Cliente {
  idCliente: number;
  nombre: string;
  rfc: string;
  credito: Credito;
  sucursal: Tipo;
  id: number;
  descripcion: null;
  esPropietario: boolean;
}

interface Credito {
  limite: number;
  utilizado: number;
  disponible: number;
  dias: number;
  estatus: string;
  desplegarFormaPago: boolean;
  idCliente: number;
}

interface ComprobanteFiscal {
  id: number;
  urlPDF: string;
  urlXML: string;
  sello: string;
}

interface Moneda {
  id: string;
  nombre: string;
  abrev: string;
  simbolo: string;
}

interface Tipo {
  id: number;
  descripcion: string;
}