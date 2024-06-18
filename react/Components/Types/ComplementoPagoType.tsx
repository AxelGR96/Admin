export default interface ComplementoPagoType {
  id: number;
  folio: string;
  fechaComprobante: string;
  total: number;
  cliente: Cliente;
  moneda: string;
  comprobanteFiscal: ComprobanteFiscal;
  estatus: string;
  urlFolioRecibo: string;
  usuario: Usuario;
}

interface Usuario {
  idUsuarioReg: string;
  nombre: string;
}

interface ComprobanteFiscal {
  urlPDF: string;
  urlXML: string;
}

interface Cliente {
  id: number;
  descripcion: string;
}