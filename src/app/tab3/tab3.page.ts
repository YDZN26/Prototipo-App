import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page implements OnInit {

  nombreUsuario: string = 'Usuario';
  mostrarCampoBusqueda = false;
  textoBusqueda: string = '';

  clientes: any[] = [];
  filteredClientes: any[] = [];
  loading = false;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    // Cargar nombre del usuario
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    if (nombreGuardado) {
      this.nombreUsuario = nombreGuardado;
    }
    
    await this.cargarClientes();
  }

  async cargarClientes() {
    this.loading = true;
    try {
      const data = await this.supabaseService.getClientes();
      this.clientes = data;
      this.filtrarClientes();
    } catch (error) {
      console.error('Error cargando clientes:', error);
    } finally {
      this.loading = false;
    }
  }

  filtrarClientes() {
    if (this.textoBusqueda.trim() === '') {
      this.filteredClientes = this.clientes;
      return;
    }

    const texto = this.textoBusqueda.toLowerCase();
    this.filteredClientes = this.clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(texto) ||
      cliente.telefono?.toLowerCase().includes(texto)
    );
  }

  editarCliente(cliente: any) {
    this.router.navigate(['/editar-cliente', cliente.id]);
  }

  crearCliente() {
    this.router.navigate(['/crear-cliente']);
  }

  async mostrarOpcionesUsuario(event: any) {
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
    // Recargar clientes cuando se vuelve a la página
    await this.cargarClientes();
  }
}