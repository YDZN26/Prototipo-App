import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key
    );
  }

  // CATEGORÍAS
  async getCategorias() {
    const { data, error } = await this.supabase
      .from('categorias')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return data;
  }

  // PRODUCTOS
  async getProductos() {
    const { data, error } = await this.supabase
      .from('productos')
      .select(`
        *,
        categorias (nombre)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async createProducto(producto: any) {
    const { data, error } = await this.supabase
      .from('productos')
      .insert([{
        nombre: producto.nombre,
        precio: producto.precioUnitario,
        costo: producto.costoUnitario,
        stock: producto.cantidad,
        categoria_id: producto.categoria,
        imagen_url: producto.imagenUrl || null
      }])
      .select();

    if (error) throw error;
    return data;
  }

  async updateProducto(id: number, producto: any) {
    const { data, error } = await this.supabase
      .from('productos')
      .update({
        nombre: producto.nombre,
        precio: producto.precioUnitario,
        costo: producto.costoUnitario,
        stock: producto.cantidad,
        categoria_id: producto.categoria,
        imagen_url: producto.imagenUrl || null
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  }

  async deleteProducto(id: number) {
    const { error } = await this.supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ACTUALIZAR STOCK DE UN PRODUCTO
  async updateStockProducto(productoId: number, cantidadVendida: number) {
    try {
      // 1. Obtener el stock actual del producto
      const { data: productoActual, error: errorGet } = await this.supabase
        .from('productos')
        .select('stock')
        .eq('id', productoId)
        .single();

      if (errorGet) throw errorGet;

      // 2. Calcular el nuevo stock
      const nuevoStock = productoActual.stock - cantidadVendida;

      // 3. Validar que no sea negativo
      if (nuevoStock < 0) {
        throw new Error(`Stock insuficiente para el producto ID ${productoId}`);
      }

      // 4. Actualizar el stock en la base de datos
      const { data, error: errorUpdate } = await this.supabase
        .from('productos')
        .update({ stock: nuevoStock })
        .eq('id', productoId)
        .select();

      if (errorUpdate) throw errorUpdate;

      console.log(`Stock actualizado: Producto ${productoId} | ${productoActual.stock} → ${nuevoStock}`);
      return data;

    } catch (error) {
      console.error('Error actualizando stock:', error);
      throw error;
    }
  }

  // ACTUALIZAR STOCK DE MÚLTIPLES PRODUCTOS
  async updateStockMultiplesProductos(productos: { id: number, cantidad: number }[]) {
    try {
      const promesas = productos.map(producto => 
        this.updateStockProducto(producto.id, producto.cantidad)
      );
      
      await Promise.all(promesas);
      console.log('Todos los stocks actualizados correctamente');
    } catch (error) {
      console.error('Error actualizando stocks múltiples:', error);
      throw error;
    }
  }

  // CLIENTES
  async getClientes() {
    const { data, error } = await this.supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async createCliente(cliente: any) {
    const { data, error } = await this.supabase
      .from('clientes')
      .insert([{
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        ci: cliente.ci || null
      }])
      .select();

    if (error) throw error;
    return data;
  }

  async updateCliente(id: number, cliente: any) {
    const { data, error } = await this.supabase
      .from('clientes')
      .update({
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        ci: cliente.ci || null
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  }

  // EMPLEADOS
  async getEmpleados() {
    const { data, error } = await this.supabase
      .from('empleados')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async createEmpleado(empleado: any) {
    const { data, error } = await this.supabase
      .from('empleados')
      .insert([{
        nombre: empleado.nombre,
        telefono: empleado.telefono,
        ci: empleado.ci,
        direccion: empleado.direccion,
        usuario: empleado.usuario,
        contrasena: empleado.contrasena,
        rol: empleado.rol
      }])
      .select();

    if (error) throw error;
    return data;
  }

  async updateEmpleado(id: number, empleado: any) {
    const { data, error } = await this.supabase
      .from('empleados')
      .update({
        nombre: empleado.nombre,
        telefono: empleado.telefono,
        ci: empleado.ci,
        direccion: empleado.direccion,
        usuario: empleado.usuario,
        contrasena: empleado.contrasena,
        rol: empleado.rol
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  }

  // PROVEEDORES
  async getProveedores() {
    const { data, error } = await this.supabase
      .from('proveedores')
      .select('*')
      .order('created_at', { ascending: false});

    if (error) throw error;
    return data;
  }

  async createProveedor(proveedor: any) {
    const { data, error } = await this.supabase
      .from('proveedores')
      .insert([{
        nombre: proveedor.nombre,
        telefono: proveedor.telefono,
        ci: proveedor.ci,
        direccion: proveedor.direccion,
        ubicacion: proveedor.ubicacion
      }])
      .select();

    if (error) throw error;
    return data;
  }

  async updateProveedor(id: number, proveedor: any) {
    const { data, error } = await this.supabase
      .from('proveedores')
      .update({
        nombre: proveedor.nombre,
        telefono: proveedor.telefono,
        ci: proveedor.ci,
        direccion: proveedor.direccion,
        ubicacion: proveedor.ubicacion
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  }

  // VENTAS
  async createVenta(venta: any) {
    const fechaActual = new Date();
    const fechaBolivia = new Date(fechaActual.getTime() - (4 * 60 * 60 * 1000));

    const { data: ventaData, error: ventaError } = await this.supabase
      .from('ventas')
      .insert([{
        fecha: fechaBolivia.toISOString(),
        cliente_id: venta.clienteId,
        metodo_pago: venta.metodoPago,
        total: venta.total,
        empleado_id: venta.empleadoId || 1
      }])
      .select();

    if (ventaError) throw ventaError;

    const ventaId = ventaData[0].id;

    const productosVenta = venta.productos.map((producto: any) => ({
      venta_id: ventaId,
      producto_id: producto.id,
      cantidad: producto.cantidad,
      precio_unitario: producto.precioUnitario,
      subtotal: producto.subtotal || (producto.cantidad * producto.precioUnitario)
    }));

    const { error: productosError } = await this.supabase
      .from('venta_productos')
      .insert(productosVenta);

    if (productosError) throw productosError;

    return ventaData[0];
  }

  async getVentasPorFecha(fechaInicio: string, fechaFin: string) {
    const { data, error } = await this.supabase
      .from('ventas')
      .select(`
        *,
        clientes (nombre),
        empleados (nombre),
        venta_productos (
          cantidad,
          precio_unitario,
          subtotal,
          producto_id,
          productos (nombre)
        )
      `)
      .gte('fecha', fechaInicio)
      .lte('fecha', fechaFin)
      .order('fecha', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getVentaPorId(id: number) {
    const { data, error } = await this.supabase
      .from('ventas')
      .select(`
        *,
        clientes (nombre),
        empleados (nombre),
        venta_productos (
          cantidad,
          precio_unitario,
          subtotal,
          producto_id,
          productos (nombre)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // LOGIN/AUTENTICACIÓN
  async login(usuario: string, contrasena: string) {
    const { data, error } = await this.supabase
      .from('empleados')
      .select('*')
      .eq('usuario', usuario)
      .eq('contrasena', contrasena)
      .single();

    if (error) throw error;
    return data;
  }
}