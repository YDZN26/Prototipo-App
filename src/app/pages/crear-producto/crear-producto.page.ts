import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.page.html',
  styleUrls: ['./crear-producto.page.scss'],
  standalone: false
})
export class CrearProductoPage implements OnInit {

  esEdicion: boolean = false;
  productoId: string = '';
  categorias: any[] = [];
  loading = false;

  producto = {
    nombre: '',
    cantidad: 0,
    precioUnitario: 0,
    costoUnitario: 0,
    categoria: '',
    imagen: null
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    await this.cargarCategorias();
    
    this.route.paramMap.subscribe(params => {
      this.productoId = params.get('id') || '';
      this.esEdicion = !!this.productoId;
      
      if (this.esEdicion) {
        this.cargarProducto();
      }
    });
  }

  async cargarCategorias() {
    try {
      this.categorias = await this.supabaseService.getCategorias();
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  }

  async cargarProducto() {
    try {
      const productos = await this.supabaseService.getProductos();
      const productoData = productos.find(p => p.id == this.productoId);
      
      if (productoData) {
        this.producto = {
          nombre: productoData.nombre,
          cantidad: productoData.stock,
          precioUnitario: productoData.precio,
          costoUnitario: productoData.costo || 0,
          categoria: productoData.categoria_id,
          imagen: null
        };
      }
    } catch (error) {
      console.error('Error cargando producto:', error);
    }
  }

  volver() {
    this.location.back();
  }

  async guardarProducto() {
    if (!this.validarProducto()) return;

    this.loading = true;

    try {
      if (this.esEdicion) {
        await this.supabaseService.updateProducto(parseInt(this.productoId), this.producto);
        console.log('Producto actualizado');
      } else {
        await this.supabaseService.createProducto(this.producto);
        console.log('Producto creado');
      }

      this.router.navigate(['/tabs/tab2']);
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('Error al guardar el producto');
    } finally {
      this.loading = false;
    }
  }

  validarProducto(): boolean {
    if (!this.producto.nombre.trim()) {
      alert('El nombre del producto es requerido');
      return false;
    }

    if (this.producto.cantidad <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return false;
    }

    if (this.producto.precioUnitario <= 0) {
      alert('El precio unitario debe ser mayor a 0');
      return false;
    }

    if (!this.producto.categoria) {
      alert('Debe seleccionar una categoría');
      return false;
    }

    return true;
  }

  seleccionarImagen() {
    console.log('Seleccionar imagen del producto');
  }
}