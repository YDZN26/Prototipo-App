import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-seleccionar-productos',
  templateUrl: './seleccionar-productos.page.html',
  styleUrls: ['./seleccionar-productos.page.scss'],
  standalone: false
})
export class SeleccionarProductosPage implements OnInit {

  // Parámetros de la venta
  clienteId: string = '';
  metodoPago: string = '';
  fecha: string = '';

  categorias = [
    { nombre: 'Todas las categorías', selected: true },
    { nombre: 'Categoría 1', selected: false },
    { nombre: 'Categoría 2', selected: false }
  ];

  productos = [
    {
      id: 1,
      nombre: 'NombreProductos',
      stock: 0,
      precio: 0,
      categoria: 'Categoría 1'
    },
    {
      id: 2,
      nombre: 'NombreProductos',
      stock: 0,
      precio: 0,
      categoria: 'Categoría 1'
    },
    {
      id: 3,
      nombre: 'NombreProductos',
      stock: 0,
      precio: 0,
      categoria: 'Categoría 2'
    },
    {
      id: 4,
      nombre: 'NombreProductos',
      stock: 0,
      precio: 0,
      categoria: 'Categoría 2'
    },
    {
      id: 5,
      nombre: 'NombreProductos',
      stock: 0,
      precio: 0,
      categoria: 'Categoría 1'
    },
    {
      id: 6,
      nombre: 'NombreProductos',
      stock: 0,
      precio: 0,
      categoria: 'Categoría 1'
    }
  ];

  filteredProductos = this.productos;
  productosSeleccionados: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // Obtener parámetros de la venta
    this.route.queryParams.subscribe(params => {
      this.clienteId = params['clienteId'];
      this.metodoPago = params['metodoPago'];
      this.fecha = params['fecha'];
    });

    this.filtrarProductos();
  }

  volver() {
    this.location.back();
  }

  seleccionarCategoria(categoriaSeleccionada: any) {
    // Desseleccionar todas las categorías
    this.categorias.forEach(cat => cat.selected = false);

    // Seleccionar la categoría clickeada
    categoriaSeleccionada.selected = true;

    this.filtrarProductos();
  }

  filtrarProductos() {
    // Filtrar por categoría
    const categoriaActiva = this.categorias.find(cat => cat.selected);
    if (categoriaActiva && categoriaActiva.nombre !== 'Todas las categorías') {
      this.filteredProductos = this.productos.filter(producto =>
        producto.categoria === categoriaActiva.nombre
      );
    } else {
      this.filteredProductos = this.productos;
    }
  }

  isProductoSeleccionado(productoId: number): boolean {
    return this.productosSeleccionados.some(p => p.id === productoId);
  }

  toggleProducto(producto: any) {
    const index = this.productosSeleccionados.findIndex(p => p.id === producto.id);

    if (index > -1) {
      // Si ya está seleccionado, lo removemos
      this.productosSeleccionados.splice(index, 1);
    } else {
      // Si no está seleccionado, lo agregamos
      this.productosSeleccionados.push({
        ...producto,
        cantidad: 1,
        subtotal: producto.precio
      });
    }
  }

  agregarProductosSeleccionados() {
  if (this.productosSeleccionados.length === 0) {
    console.log('No hay productos seleccionados');
    return;
  }

  // Navegar a la página de confirmación (carrito)
  this.router.navigate(['/confirmar-productos'], {
    queryParams: {
      productos: JSON.stringify(this.productosSeleccionados)
    }
  });
}
}
