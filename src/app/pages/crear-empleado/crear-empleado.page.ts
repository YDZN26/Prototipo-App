import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-crear-empleado',
  templateUrl: './crear-empleado.page.html',
  styleUrls: ['./crear-empleado.page.scss'],
  standalone: false
})
export class CrearEmpleadoPage implements OnInit {

  esEdicion: boolean = false;
  empleadoId: string = '';

  empleado = {
    nombre: '',
    telefono: '',
    ci: '',
    direccion: '',
    usuario: '',
    contrasena: '',
    rol: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // Verificar si es edición
    this.route.paramMap.subscribe(params => {
      this.empleadoId = params.get('id') || '';
      this.esEdicion = !!this.empleadoId;

      if (this.esEdicion) {
        this.cargarEmpleado();
      }
    });
  }

  cargarEmpleado() {
    // Aquí cargarías el empleado desde la base de datos
    // Por ahora simulamos datos
    this.empleado = {
      nombre: 'Empleado Ejemplo',
      telefono: '+591 12345678',
      ci: '12345678 LP',
      direccion: 'Calle Ejemplo #123',
      usuario: 'empleado123',
      contrasena: '',
      rol: 'vendedor'
    };
  }

  volver() {
    this.location.back();
  }

  guardarEmpleado() {
    // Validar que los campos requeridos estén llenos
    if (!this.empleado.nombre.trim()) {
      console.log('El nombre del empleado es requerido');
      return;
    }

    if (!this.empleado.telefono.trim()) {
      console.log('El teléfono del empleado es requerido');
      return;
    }

    if (!this.empleado.ci.trim()) {
      console.log('El C.I. del empleado es requerido');
      return;
    }

    if (!this.empleado.direccion.trim()) {
      console.log('La dirección del empleado es requerida');
      return;
    }

    if (!this.empleado.usuario.trim()) {
      console.log('El usuario del empleado es requerido');
      return;
    }

    if (!this.empleado.contrasena.trim() && !this.esEdicion) {
      console.log('La contraseña del empleado es requerida');
      return;
    }

    if (!this.empleado.rol) {
      console.log('Debe seleccionar un rol para el empleado');
      return;
    }

    // Aquí enviarías los datos a la base de datos
    console.log('Guardando empleado:', this.empleado);

    if (this.esEdicion) {
      console.log('Actualizando empleado existente');
      // Actualizar empleado existente
    } else {
      console.log('Creando nuevo empleado');
      // Crear nuevo empleado
    }

    // Volver a la página de empleados
    this.router.navigate(['/tabs/empleados']);
  }
}
