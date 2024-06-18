export default interface DetalleCotizacionType {
  idCotizacion: number;
  cotizacion: number;
  fecha: string;
  sucursal: Sucursal;
  cliente: Cliente;
  ordenCompra: string;
  noEconomico: string;
  nombreReceptor: string;
  noRequisicion: string;
  usuario: Usuario;
  moneda: string;
  metodoPago: string;
  productos: Producto[];
}

interface Producto {
  partida: number;
  descripcionEstatus: string;
  numeroParte: string;
  nuevoNumeroParte: string;
  descripcion: string;
  existencia: number;
  cantidad: number;
  precio: number;
  subtotal: number;
  total: number;
  subTotalMXN: number;
  totalMXN: number;
  skuId: number;
  productId: number;
  esND: boolean;
  esOriginal: boolean;
  tiempoEntrega: TiempoEntrega;
  urlImg: string;
}

interface TiempoEntrega {
  dias: number;
  descripcion: string;
}

interface Usuario {
  id: number;
  activo: boolean;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nommbreCompleto: string;
  email: string;
}

interface Cliente {
  idCliente: number;
  nombre: string;
  rfc: string;
}

interface Sucursal {
  id: number;
  descripcion: string;
}