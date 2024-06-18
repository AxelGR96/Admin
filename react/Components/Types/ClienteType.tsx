export default interface ClienteType {
  idCliente: number;
  nombre: string;
  RFC: string;
  Credito: Credito;
  Sucursal: Sucursal;
  id: number;
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