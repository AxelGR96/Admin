export default interface FacturaSaldoType {
  monto: number;
  id: number;
  serie: string;
  folio: string;
  fechaFactura: string;
  fechaVencimiento: string;
  total: number;
  saldo: number;
  cliente: Cliente;
  sucursal: Cliente;
  moneda: string;
  comprobanteFiscal: ComprobanteFiscal;
}

interface ComprobanteFiscal {
  id: number;
  urlPDF: string;
  urlXML: string;
  sello: string;
}

interface Cliente {
  id: number;
  descripcion: string;
}