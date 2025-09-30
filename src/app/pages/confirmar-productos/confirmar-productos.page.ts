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

  // Datos de la venta temporal
  ventaTemporal: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit() {
    // Recuperar datos de venta temporal del localStorage
    const ventaTemp = localStorage.getItem('ventaTemporal');
    if (ventaTemp) {
      this.ventaTemporal = JSON.parse(ventaTemp);
    }

    // Obtener productos seleccionados
    this.route.queryParams.subscribe(params => {
      if (params['productos']) {
        this.productosCarrito = JSON.parse(params['productos']);
        // Asegurar que cada producto tenga las propiedades necesarias
        this.productosCarrito.forEach(producto => {
          if (!producto.cantidad) producto.cantidad = 1;
          if (!producto.precioUnitario) producto.precioUnitario = producto.precio || 0;
          if (!producto.stock) producto.stock = 10;
        });
        this.actualizarConcepto();
      }
    });
  }

  volver() {
    this.location.back();
  }

  incrementarCantidad(index: number) {
    if (this.productosCarrito[index].cantidad < this.productosCarrito[index].stock) {
      this.productosCarrito[index].cantidad++;
      this.actualizarSubtotal(index);
      this.actualizarConcepto();
    }
  }

  decrementarCantidad(index: number) {
    if (this.productosCarrito[index].cantidad > 1) {
      this.productosCarrito[index].cantidad--;
      this.actualizarSubtotal(index);
      this.actualizarConcepto();
    }
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
    // Volver a la página de selección de productos
    this.router.navigate(['/seleccionar-productos']);
  }

  async confirmarVenta() {
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
      // Preparar datos de la venta para Supabase
      const ventaFinal = {
        fecha: new Date().toISOString(),
        clienteId: parseInt(this.ventaTemporal.clienteId),
        metodoPago: this.ventaTemporal.metodoPago,
        productos: this.productosCarrito,
        total: this.calcularTotal()
      };

      // Crear la venta en Supabase
      const ventaCreada = await this.supabaseService.createVenta(ventaFinal);

      console.log('Venta creada exitosamente:', ventaCreada);

      // Limpiar datos temporales
      localStorage.removeItem('ventaTemporal');

      // Navegar al detalle de venta
      this.router.navigate(['/detalle-venta'], {
        queryParams: {
          ventaData: JSON.stringify({
            id: ventaCreada.id,
            fecha: ventaCreada.fecha,
            clienteId: ventaFinal.clienteId,
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
