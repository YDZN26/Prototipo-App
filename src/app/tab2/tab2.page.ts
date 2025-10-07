import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page implements OnInit {

  nombreUsuario: string = 'Usuario';
  mostrarCampoBusqueda = false;
  textoBusqueda: string = '';

  categorias: any[] = [];
  productos: any[] = [];
  filteredProductos: any[] = [];
  loading = false;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private alertController: AlertController
  ) {
    // Escuchar eventos de navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Si la URL contiene /tab2, recargar productos
      if (event.url.includes('/tab2') || event.url.includes('/tabs/tab2')) {
        console.log('🔄 Navegación detectada a tab2, recargando productos...');
        this.cargarProductos();
      }
    });
  }

  async ngOnInit() {
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    if (nombreGuardado) {
      this.nombreUsuario = nombreGuardado;
    }

    await this.cargarDatos();
  }

  isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'administrador';
  }

  async cargarDatos() {
    this.loading = true;
    try {
      const categoriasData = await this.supabaseService.getCategorias();
      this.categorias = [
        { id: 0, nombre: 'Todas las categorías', selected: true },
        ...categoriasData.map(cat => ({ ...cat, selected: false }))
      ];

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
        categoria_id: producto.categoria_id,
        imagen_url: producto.imagen_url
      }));
      this.filtrarProductos();
      console.log('Productos cargados:', this.productos.length);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
    const placeholder = event.target.nextElementSibling;
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  }

  seleccionarCategoria(categoriaSeleccionada: any) {
    this.categorias.forEach(cat => cat.selected = false);
    categoriaSeleccionada.selected = true;
    this.filtrarProductos();
  }

  filtrarProductos() {
    let productosTemp = this.productos;

    const categoriaActiva = this.categorias.find(cat => cat.selected);
    if (categoriaActiva && categoriaActiva.id !== 0) {
      productosTemp = productosTemp.filter(producto =>
        producto.categoria_id === categoriaActiva.id
      );
    }

    if (this.textoBusqueda.trim() !== '') {
      const texto = this.textoBusqueda.toLowerCase();
      productosTemp = productosTemp.filter(producto =>
        producto.nombre.toLowerCase().includes(texto)
      );
    }

    this.filteredProductos = productosTemp;
  }

  editarProducto(producto: any) {
    if (!this.isAdmin()) {
      alert('No tienes permisos para editar productos');
      return;
    }
    this.router.navigate(['/editar-producto', producto.id]);
  }

  crearProducto() {
    this.router.navigate(['/crear-producto']);
  }

  async mostrarOpcionesUsuario(_event: any) {
    const alert = await this.alertController.create({
      header: this.nombreUsuario,
      message: '¿Qué deseas hacer?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Cerrar Sesión',
          cssClass: 'danger',
          handler: () => {
            this.confirmarCerrarSesion();
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmarCerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Cerrar Sesión',
          cssClass: 'danger',
          handler: () => {
            this.cerrarSesion();
          }
        }
      ]
    });

    await alert.present();
  }

  cerrarSesion() {
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }

  async ionViewWillEnter() {
    console.log('🔄 ionViewWillEnter ejecutado en tab2');
    await this.cargarProductos();
  }
}
