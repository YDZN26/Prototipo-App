import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase';

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

  categorias: any[] = [];
  productos: any[] = [];
  filteredProductos: any[] = [];
  loading = false;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    this.loading = true;
    try {
      // Cargar categorías
      const categoriasData = await this.supabaseService.getCategorias();
      this.categorias = [
        { id: 0, nombre: 'Todas las categorías', selected: true },
        ...categoriasData.map(cat => ({ ...cat, selected: false }))
      ];

      // Cargar productos
      await this.cargarProductos();
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      this.loading = false;
    }
  }

  async cargarProductos() {
    try {
      const data = await this.supabaseService.getProductos();
      this.productos = data.map(producto => ({
        id: producto.id,
        nombre: producto.nombre,
        stock: producto.stock,
        precio: producto.precio,
        categoria: producto.categorias?.nombre || 'Sin categoría',
        categoria_id: producto.categoria_id
      }));
      this.filtrarProductos();
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
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
    if (categoriaActiva && categoriaActiva.id !== 0) {
      productosTemp = productosTemp.filter(producto => 
        producto.categoria_id === categoriaActiva.id
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

  editarProducto(producto: any) {
    this.router.navigate(['/editar-producto', producto.id]);
  }

  crearProducto() {
    this.router.navigate(['/crear-producto']);
  }

  async ionViewWillEnter() {
    // Recargar productos cuando se vuelve a la página
    await this.cargarProductos();
  }
}