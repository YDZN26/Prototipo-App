import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.page.html',
  styleUrls: ['./empleados.page.scss'],
  standalone: false
})
export class EmpleadosPage implements OnInit {

  nombreUsuario: string = 'Usuario';
  mostrarCampoBusqueda = false;
  textoBusqueda: string = '';

  empleados: any[] = [];
  filteredEmpleados: any[] = [];
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
    
    await this.cargarEmpleados();
  }

  async cargarEmpleados() {
    this.loading = true;
    try {
      const data = await this.supabaseService.getEmpleados();
      this.empleados = data;
      this.filtrarEmpleados();
    } catch (error) {
      console.error('Error cargando empleados:', error);
    } finally {
      this.loading = false;
    }
  }

  filtrarEmpleados() {
    if (this.textoBusqueda.trim() === '') {
      this.filteredEmpleados = this.empleados;
      return;
    }

    const texto = this.textoBusqueda.toLowerCase();
    this.filteredEmpleados = this.empleados.filter(empleado =>
      empleado.nombre.toLowerCase().includes(texto) ||
      empleado.telefono?.toLowerCase().includes(texto) ||
      empleado.direccion?.toLowerCase().includes(texto) ||
      empleado.ci?.toLowerCase().includes(texto)
    );
  }

  editarEmpleado(empleado: any) {
    this.router.navigate(['/editar-empleado', empleado.id]);
  }

  crearEmpleado() {
    this.router.navigate(['/crear-empleado']);
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
    await this.cargarEmpleados();
  }
}