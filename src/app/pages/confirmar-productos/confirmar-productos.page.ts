import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-confirmar-productos',
  templateUrl: './confirmar-productos.page.html',
  styleUrls: ['./confirmar-productos.page.scss'],
  standalone: false
})
export class ConfirmarProductosPage implements OnInit {

  productosCarrito: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // Obtener productos seleccionados
    this.route.queryParams.subscribe(params => {
      if (params['productos']) {
        this.productosCarrito = JSON.parse(params['productos']);
        // Asegurar que cada producto tenga las propiedades necesarias
        this.productosCarrito.forEach(producto => {
          if (!producto.cantidad) producto.cantidad = 1;
          if (!producto.precioUnitario) producto.precioUnitario = producto.precio || 0;
          if (!producto.stock) producto.stock = 10; // Stock ejemplo
        });
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
    }
  }

  decrementarCantidad(index: number) {
    if (this.productosCarrito[index].cantidad > 1) {
      this.productosCarrito[index].cantidad--;
      this.actualizarSubtotal(index);
    }
  }

  actualizarSubtotal(index: number) {
    const producto = this.productosCarrito[index];
    producto.subtotal = producto.cantidad * producto.precioUnitario;
  }

  eliminarProducto(index: number) {
    this.productosCarrito.splice(index, 1);
  }

  calcularTotal(): number {
    return this.productosCarrito.reduce((total, producto) => {
      return total + (producto.cantidad * producto.precioUnitario);
    }, 0);
  }

  confirmarVenta() {
    if (this.productosCarrito.length === 0) {
      console.log('No hay productos en el carrito');
      return;
    }

    // Navegar a nueva venta con los productos confirmados
    this.router.navigate(['/nueva-venta'], {
      queryParams: {
        productos: JSON.stringify(this.productosCarrito),
        total: this.calcularTotal()
      }
    });
  }
}
