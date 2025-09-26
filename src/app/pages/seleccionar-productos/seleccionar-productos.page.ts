import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-seleccionar-productos',
  templateUrl: './seleccionar-productos.page.html',
  styleUrls: ['./seleccionar-productos.page.scss'],
  standalone: false
})
export class SeleccionarProductosPage implements OnInit {

  categorias: any[] = [];
  productos: any[] = [];
  filteredProductos: any[] = [];
  productosSeleccionados: any[] = [];
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
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

      // Cargar productos con stock disponible
      const productosData = await this.supabaseService.getProductos();
      this.productos = productosData
        .filter(producto => producto.stock > 0) // Solo productos con stock
        .map(producto => ({
          id: producto.id,
          nombre: producto.nombre,
          stock: producto.stock,
          precio: producto.precio,
          categoria: producto.categorias?.nombre || 'Sin categoría',
          categoria_id: producto.categoria_id
        }));

      this.filtrarProductos();
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      this.loading = false;
    }
  }

  volver() {
    this.location.back();
  }

  seleccionarCategoria(categoriaSeleccionada: any) {
    this.categorias.forEach(cat => cat.selected = false);
    categoriaSeleccionada.selected = true;
    this.filtrarProductos();
  }

  filtrarProductos() {
    const categoriaActiva = this.categorias.find(cat => cat.selected);
    if (categoriaActiva && categoriaActiva.id !== 0) {
      this.filteredProductos = this.productos.filter(producto => 
        producto.categoria_id === categoriaActiva.id
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
      this.productosSeleccionados.splice(index, 1);
    } else {
      this.productosSeleccionados.push({
        ...producto,
        cantidad: 1,
        precioUnitario: producto.precio,
        subtotal: producto.precio
      });
    }
  }

  agregarProductosSeleccionados() {
    if (this.productosSeleccionados.length === 0) {
      alert('No hay productos seleccionados');
      return;
    }

    this.router.navigate(['/confirmar-productos'], {
      queryParams: {
        productos: JSON.stringify(this.productosSeleccionados)
      }
    });
  }
}