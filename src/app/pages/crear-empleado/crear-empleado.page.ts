import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { IonModal } from '@ionic/angular';
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
    private supabaseService: SupabaseService
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
          contrasena: '',
          rol: empleadoData.rol
        };

        // Establecer nombre del rol seleccionado
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

  // Funciones para el modal de roles
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
        console.log('Empleado actualizado');
      } else {
        await this.supabaseService.createEmpleado(this.empleado);
        console.log('Empleado creado');
      }

      this.router.navigate(['/tabs/empleados']);
    } catch (error) {
      console.error('Error guardando empleado:', error);
      alert('Error al guardar el empleado. Verifica que el usuario no esté duplicado.');
    } finally {
      this.loading = false;
    }
  }

  validarEmpleado(): boolean {
    if (!this.empleado.nombre.trim()) {
      alert('El nombre del empleado es requerido');
      return false;
    }

    if (!this.empleado.telefono.trim()) {
      alert('El teléfono del empleado es requerido');
      return false;
    }

    if (!this.empleado.ci.trim()) {
      alert('El C.I. del empleado es requerido');
      return false;
    }

    if (!this.empleado.direccion.trim()) {
      alert('La dirección del empleado es requerida');
      return false;
    }

    if (!this.empleado.usuario.trim()) {
      alert('El usuario del empleado es requerido');
      return false;
    }

    if (!this.empleado.contrasena.trim() && !this.esEdicion) {
      alert('La contraseña del empleado es requerida');
      return false;
    }

    if (!this.empleado.rol) {
      alert('Debe seleccionar un rol para el empleado');
      return false;
    }

    return true;
  }
}
