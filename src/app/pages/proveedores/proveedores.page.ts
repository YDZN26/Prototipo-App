import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SupabaseService } from '../../services/supabase';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.page.html',
  styleUrls: ['./proveedores.page.scss'],
  standalone: false
})
export class ProveedoresPage implements OnInit {

  nombreUsuario: string = 'Usuario';
  mostrarCampoBusqueda = false;
  textoBusqueda: string = '';

  proveedores: any[] = [];
  filteredProveedores: any[] = [];
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
      // Si la URL contiene /proveedores, recargar proveedores
      if (event.url.includes('/proveedores') || event.url.includes('/tabs/proveedores')) {
        console.log('🔄 Navegación detectada a proveedores, recargando...');
        this.cargarProveedores();
      }
    });
  }

  async ngOnInit() {
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    if (nombreGuardado) {
      this.nombreUsuario = nombreGuardado;
    }

    await this.cargarProveedores();
  }

  async cargarProveedores() {
    this.loading = true;
    try {
      const data = await this.supabaseService.getProveedores();
      this.proveedores = data;
      this.filtrarProveedores();
      console.log('✅ Proveedores cargados:', this.proveedores.length);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    } finally {
      this.loading = false;
    }
  }

  filtrarProveedores() {
    if (this.textoBusqueda.trim() === '') {
      this.filteredProveedores = this.proveedores;
      return;
    }

    const texto = this.textoBusqueda.toLowerCase();
    this.filteredProveedores = this.proveedores.filter(proveedor =>
      proveedor.nombre.toLowerCase().includes(texto) ||
      proveedor.telefono?.toLowerCase().includes(texto) ||
      proveedor.direccion?.toLowerCase().includes(texto) ||
      proveedor.ci?.toLowerCase().includes(texto)
    );
  }

  editarProveedor(proveedor: any) {
    this.router.navigate(['/editar-proveedor', proveedor.id]);
  }

  crearProveedor() {
    this.router.navigate(['/crear-proveedor']);
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
    console.log('🔄 ionViewWillEnter ejecutado en proveedores');
    await this.cargarProveedores();
  }
}
