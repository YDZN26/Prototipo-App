import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page implements OnInit {

  nombreUsuario: string = 'NombreUsuario';
  mostrarCampoBusqueda = false;
  textoBusqueda: string = '';

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
    }
  ];

  filteredProductos = this.productos;

  constructor(private router: Router) {}

  ngOnInit() {
    this.filtrarProductos();
  }

  seleccionarCategoria(categoriaSeleccionada: any) {
    // Desseleccionar todas las categorías
    this.categorias.forEach(cat => cat.selected = false);
    
    // Seleccionar la categoría clickeada
    categoriaSeleccionada.selected = true;
    
    this.filtrarProductos();
  }

  filtrarProductos() {
    let productosTemp = this.productos;

    // Filtrar por categoría
    const categoriaActiva = this.categorias.find(cat => cat.selected);
    if (categoriaActiva && categoriaActiva.nombre !== 'Todas las categorías') {
      productosTemp = productosTemp.filter(producto => 
        producto.categoria === categoriaActiva.nombre
      );
    }

    // Filtrar por búsqueda de texto
    if (this.textoBusqueda.trim() !== '') {
      const texto = this.textoBusqueda.toLowerCase();
      productosTemp = productosTemp.filter(producto =>
        producto.nombre.toLowerCase().includes(texto)
      );
    }

    this.filteredProductos = productosTemp;
  }

  crearProducto() {
  this.router.navigate(['/crear-producto']);
}

editarProducto(producto: any) {
  this.router.navigate(['/editar-producto', producto.id]);
}
}