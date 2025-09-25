import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.page.html',
  styleUrls: ['./empleados.page.scss'],
  standalone: false
})
export class EmpleadosPage implements OnInit {

  nombreUsuario: string = 'NombreUsuario';
  mostrarCampoBusqueda = false;
  textoBusqueda: string = '';

  empleados = [
    {
      id: 1,
      nombre: 'NombreEmpleado',
      telefono: 'Telefono',
      direccion: 'Dirección',
      ci: 'C.I.'
    },
    {
      id: 2,
      nombre: 'NombreEmpleado',
      telefono: 'Telefono',
      direccion: 'Dirección',
      ci: 'C.I.'
    },
    {
      id: 3,
      nombre: 'NombreEmpleado',
      telefono: 'Telefono',
      direccion: 'Dirección',
      ci: 'C.I.'
    },
    {
      id: 4,
      nombre: 'NombreEmpleado',
      telefono: 'Telefono',
      direccion: 'Dirección',
      ci: 'C.I.'
    }
  ];

  filteredEmpleados = this.empleados;

  constructor(private router: Router) {}

  ngOnInit() {
    this.filtrarEmpleados();
  }

  filtrarEmpleados() {
    if (this.textoBusqueda.trim() === '') {
      this.filteredEmpleados = this.empleados;
      return;
    }

    const texto = this.textoBusqueda.toLowerCase();
    this.filteredEmpleados = this.empleados.filter(empleado =>
      empleado.nombre.toLowerCase().includes(texto) ||
      empleado.telefono.toLowerCase().includes(texto) ||
      empleado.direccion.toLowerCase().includes(texto) ||
      empleado.ci.toLowerCase().includes(texto)
    );
  }

  editarEmpleado(empleado: any) {
    // Navegar a página de editar empleado
    console.log('Editar empleado:', empleado);
    this.router.navigate(['/editar-empleado', empleado.id]);
  }

  crearEmpleado() {
    // Navegar a página de crear empleado
    console.log('Crear nuevo empleado');
    this.router.navigate(['/crear-empleado']);
  }
}
