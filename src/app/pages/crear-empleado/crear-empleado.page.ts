import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { IonModal, AlertController } from '@ionic/angular';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-crear-empleado',
  templateUrl: './crear-empleado.page.html',
  styleUrls: ['./crear-empleado.page.scss'],
  standalone: false
})
export class CrearEmpleadoPage implements OnInit {

  @ViewChild('modalRoles', { static: false }) modalRoles!: IonModal;

  esEdicion: boolean = false;
  empleadoId: string = '';
  loading = false;
  modalRolesAbierto: boolean = false;
  rolSeleccionadoNombre: string = '';
  mostrarContrasena: boolean = false;

  empleado = {
    nombre: '',
    telefono: '',
    ci: '',
    direccion: '',
    usuario: '',
    contrasena: '',
    rol: ''
  };

  roles = [
    { value: 'administrador', label: 'Administrador' },
    { value: 'vendedor', label: 'Vendedor' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private supabaseService: SupabaseService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.empleadoId = params.get('id') || '';
      this.esEdicion = !!this.empleadoId;

      if (this.esEdicion) {
        this.cargarEmpleado();
      }
    });
  }

  async cargarEmpleado() {
    try {
      const empleados = await this.supabaseService.getEmpleados();
      const empleadoData = empleados.find(e => e.id == this.empleadoId);

      if (empleadoData) {
        this.empleado = {
          nombre: empleadoData.nombre,
          telefono: empleadoData.telefono || '',
          ci: empleadoData.ci || '',
          direccion: empleadoData.direccion || '',
          usuario: empleadoData.usuario,
          contrasena: empleadoData.contrasena || '',
          rol: empleadoData.rol
        };

        const rolSeleccionado = this.roles.find(r => r.value === empleadoData.rol);
        if (rolSeleccionado) {
          this.rolSeleccionadoNombre = rolSeleccionado.label;
        }
      }
    } catch (error) {
      console.error('Error cargando empleado:', error);
    }
  }

  volver() {
    this.location.back();
  }

  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  validarSoloNumeros(event: any) {
    const input = event.target;
    const valor = input.value;
    const soloNumeros = valor.replace(/\D/g, '');

    if (valor !== soloNumeros) {
      this.empleado.telefono = soloNumeros;
      input.value = soloNumeros;
    }
  }

  abrirModalRoles() {
    this.modalRolesAbierto = true;
  }

  cerrarModalRoles() {
    this.modalRolesAbierto = false;
  }

  seleccionarRol(rol: any) {
    this.empleado.rol = rol.value;
    this.rolSeleccionadoNombre = rol.label;
    this.cerrarModalRoles();
  }

  async guardarEmpleado() {
    if (!this.validarEmpleado()) return;

    this.loading = true;

    try {
      if (this.esEdicion) {
        await this.supabaseService.updateEmpleado(parseInt(this.empleadoId), this.empleado);
      } else {
        await this.supabaseService.createEmpleado(this.empleado);
      }

      this.router.navigate(['/tabs/empleados']);
    } catch (error) {
      console.error('Error guardando empleado:', error);
      await this.mostrarAlerta('Error', 'No se pudo guardar el empleado. Verifica que el usuario no esté duplicado.');
    } finally {
      this.loading = false;
    }
  }

  validarEmpleado(): boolean {
    if (!this.empleado.nombre.trim()) {
      this.mostrarAlerta('Error', 'El nombre del empleado es requerido');
      return false;
    }

    if (!this.empleado.telefono.trim()) {
      this.mostrarAlerta('Error', 'El teléfono del empleado es requerido');
      return false;
    }

    if (!this.empleado.ci.trim()) {
      this.mostrarAlerta('Error', 'El C.I. del empleado es requerido');
      return false;
    }

    if (!this.empleado.direccion.trim()) {
      this.mostrarAlerta('Error', 'La dirección del empleado es requerida');
      return false;
    }

    if (!this.empleado.usuario.trim()) {
      this.mostrarAlerta('Error', 'El usuario del empleado es requerido');
      return false;
    }

    if (!this.empleado.contrasena.trim() && !this.esEdicion) {
      this.mostrarAlerta('Error', 'La contraseña del empleado es requerida');
      return false;
    }

    if (!this.empleado.rol) {
      this.mostrarAlerta('Error', 'Debe seleccionar un rol para el empleado');
      return false;
    }

    return true;
  }

  // Confirmar eliminación del empleado
  async confirmarEliminarEmpleado() {
    const alert = await this.alertController.create({
      header: '¿Eliminar Empleado?',
      message: '¿Estás seguro que deseas eliminar este empleado? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: () => {
            this.eliminarEmpleado();
          }
        }
      ]
    });

    await alert.present();
  }

  // Eliminar empleado (eliminación lógica)
  async eliminarEmpleado() {
    this.loading = true;

    try {
      await this.supabaseService.deleteEmpleado(parseInt(this.empleadoId));

      const successAlert = await this.alertController.create({
        header: 'Empleado Eliminado',
        message: 'El empleado ha sido eliminado exitosamente',
        buttons: ['OK']
      });

      await successAlert.present();
      await successAlert.onDidDismiss();

      this.router.navigate(['/tabs/empleados']);
    } catch (error) {
      console.error('Error eliminando empleado:', error);
      await this.mostrarAlerta('Error', 'No se pudo eliminar el empleado');
    } finally {
      this.loading = false;
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}
