import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-confirmar-productos',
  templateUrl: './confirmar-productos.page.html',
  styleUrls: ['./confirmar-productos.page.scss'],
  standalone: false
})
export class ConfirmarProductosPage implements OnInit {

  productosCarrito: any[] = [];
  conceptoVenta: string = '';
  loading: boolean = false;
  ventaTemporal: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit() {
    const ventaTemp = localStorage.getItem('ventaTemporal');
    if (ventaTemp) {
      this.ventaTemporal = JSON.parse(ventaTemp);
    }

    this.route.queryParams.subscribe(params => {
      if (params['productos']) {
        this.productosCarrito = JSON.parse(params['productos']);
        this.productosCarrito.forEach(producto => {
          if (!producto.cantidad) producto.cantidad = 1;
          if (!producto.precioUnitario) producto.precioUnitario = producto.precio || 0;
          if (!producto.stock) producto.stock = 10;
          producto.cantidadTexto = producto.cantidad.toString();
          producto.cantidadInvalida = false;
        });
        this.actualizarConcepto();
      }
    });
  }

  volver() {
    this.location.back();
  }

  incrementarCantidad(index: number) {
    const producto = this.productosCarrito[index];
    if (producto.cantidad < producto.stock) {
      producto.cantidad++;
      producto.cantidadTexto = producto.cantidad.toString();
      producto.cantidadInvalida = false;
      this.actualizarSubtotal(index);
      this.actualizarConcepto();
    }
  }

  decrementarCantidad(index: number) {
    const producto = this.productosCarrito[index];
    if (producto.cantidad > 1) {
      producto.cantidad--;
      producto.cantidadTexto = producto.cantidad.toString();
      producto.cantidadInvalida = false;
      this.actualizarSubtotal(index);
      this.actualizarConcepto();
    }
  }

  onCantidadFocus(index: number) {
    const producto = this.productosCarrito[index];
    producto.cantidadInvalida = false;
  }

  onCantidadInput(index: number, event: any) {
    const producto = this.productosCarrito[index];
    const textoIngresado = event.target.value;

    producto.cantidadTexto = textoIngresado;

    if (!textoIngresado || textoIngresado.trim() === '') {
      producto.cantidadInvalida = true;
      return;
    }

    const valor = parseInt(textoIngresado);

    if (isNaN(valor) || valor <= 0) {
      producto.cantidadInvalida = true;
      return;
    }

    if (valor > producto.stock) {
      producto.cantidad = producto.stock;
      producto.cantidadTexto = producto.stock.toString();
      event.target.value = producto.stock;
    } else {
      producto.cantidad = valor;
    }

    producto.cantidadInvalida = false;
    this.actualizarSubtotal(index);
    this.actualizarConcepto();
  }

  validarCantidadAlSalir(index: number) {
    const producto = this.productosCarrito[index];
    const valor = parseInt(producto.cantidadTexto);

    if (!producto.cantidadTexto || producto.cantidadTexto.trim() === '' || isNaN(valor) || valor <= 0) {
      producto.cantidadInvalida = true;
      producto.cantidad = 1;
      producto.cantidadTexto = '1';
      this.actualizarSubtotal(index);
      this.actualizarConcepto();
      return;
    }

    if (valor > producto.stock) {
      producto.cantidad = producto.stock;
      producto.cantidadTexto = producto.stock.toString();
    } else {
      producto.cantidad = valor;
      producto.cantidadTexto = valor.toString();
    }

    producto.cantidadInvalida = false;
    this.actualizarSubtotal(index);
    this.actualizarConcepto();
  }

  validarPrecio(index: number, event: any) {
    const input = event.target;
    let valor = parseFloat(input.value);
    const producto = this.productosCarrito[index];

    if (isNaN(valor) || valor < 0) {
      valor = 0;
    }

    valor = Math.round(valor * 100) / 100;
    producto.precioUnitario = valor;
    input.value = valor;
    this.actualizarSubtotal(index);
  }

  actualizarSubtotal(index: number) {
    const producto = this.productosCarrito[index];
    producto.subtotal = producto.cantidad * producto.precioUnitario;
  }

  eliminarProducto(index: number) {
    this.productosCarrito.splice(index, 1);
    this.actualizarConcepto();
  }

  calcularTotal(): number {
    return this.productosCarrito.reduce((total, producto) => {
      return total + (producto.cantidad * producto.precioUnitario);
    }, 0);
  }

  hayCantidadesInvalidas(): boolean {
    return this.productosCarrito.some(p => p.cantidadInvalida);
  }

  actualizarConcepto() {
    const productosCount = this.productosCarrito.length;

    if (productosCount === 0) {
      this.conceptoVenta = 'Sin productos';
    } else if (productosCount === 1) {
      const producto = this.productosCarrito[0];
      this.conceptoVenta = `${producto.cantidad} ${producto.nombre}`;
    } else if (productosCount === 2) {
      const nombres = this.productosCarrito.map(p => `${p.cantidad} ${p.nombre}`);
      this.conceptoVenta = nombres.join(', ');
    } else {
      const nombres = this.productosCarrito.slice(0, 2).map(p => p.nombre);
      this.conceptoVenta = `${productosCount} productos: ${nombres.join(', ')}...`;
    }
  }

  agregarMasProductos() {
    this.router.navigate(['/seleccionar-productos'], {
      queryParams: {
        carritoActual: JSON.stringify(this.productosCarrito.map(p => ({
          id: p.id,
          nombre: p.nombre,
          stock: p.stock,
          precio: p.precio,
          categoria: p.categoria,
          categoria_id: p.categoria_id,
          cantidad: p.cantidad,
          precioUnitario: p.precioUnitario,
          subtotal: p.subtotal
        })))
      }
    });
  }

  async confirmarVenta() {
  if (this.hayCantidadesInvalidas()) {
    alert('Por favor corrige las cantidades inválidas antes de confirmar');
    return;
  }

  if (this.productosCarrito.length === 0) {
    alert('No hay productos en el carrito');
    return;
  }

  if (!this.ventaTemporal) {
    alert('Error: No se encontraron los datos de la venta');
    return;
  }

  this.loading = true;

  try {
    const ahora = new Date();

    console.log('Fecha local del sistema:', ahora.toString());
    console.log('Fecha ISO que se guardará:', ahora.toISOString());

    // Obtener el ID del empleado actual desde localStorage
    const empleadoId = parseInt(localStorage.getItem('userId') || '1');
    console.log('👤 Empleado actual realizando la venta:', empleadoId);

    const ventaFinal = {
      fecha: ahora.toISOString(),
      clienteId: parseInt(this.ventaTemporal.clienteId),
      metodoPago: this.ventaTemporal.metodoPago,
      empleadoId: empleadoId,
      productos: this.productosCarrito,
      total: this.calcularTotal()
    };

    const ventaCreada = await this.supabaseService.createVenta(ventaFinal);
    console.log('Venta creada exitosamente:', ventaCreada);

    try {
      const productosParaActualizar = this.productosCarrito.map(p => ({
        id: p.id,
        cantidad: p.cantidad
      }));

      await this.supabaseService.updateStockMultiplesProductos(productosParaActualizar);
      console.log('Stocks actualizados correctamente');
    } catch (errorStock) {
      console.error('Error actualizando stocks:', errorStock);
      alert('Venta registrada correctamente, pero hubo un problema actualizando el inventario.');
    }

    localStorage.removeItem('ventaTemporal');


    this.router.navigate(['/detalle-venta'], {
      queryParams: {
        ventaData: JSON.stringify({
          id: ventaCreada.id,
          fecha: ventaCreada.fecha,
          clienteId: ventaFinal.clienteId,
          empleado_id: empleadoId,
          metodoPago: ventaFinal.metodoPago,
          total: ventaFinal.total,
          productos: this.productosCarrito
        })
      }
    });

  } catch (error) {
    console.error('Error creando venta:', error);
    alert('Error al crear la venta. Intenta nuevamente.');
  } finally {
    this.loading = false;
  }
}
}
