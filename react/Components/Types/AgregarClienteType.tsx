export default interface AgregarClienteType {
  idCliente: number;
  nombre: string;
  RFC: string;
  Sucursal: Sucursal;
  id: number;
  esPropietario: boolean;
}

interface Sucursal {
  id: number;
  descripcion: string;
}