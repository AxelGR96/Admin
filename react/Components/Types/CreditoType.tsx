export default interface CreditoType {
  idCliente: number;
  nombre: string;
  rfc: string;
  credito: Credito;
  sucursal: Sucursal;
  id: number;
  descripcion: null;
  esPropietario: boolean;
}

interface Sucursal {
  id: number;
  descripcion: string;
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