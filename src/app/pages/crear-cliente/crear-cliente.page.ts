import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.page.html',
  styleUrls: ['./crear-cliente.page.scss'],
  standalone: false
})
export class CrearClientePage implements OnInit {

  esEdicion: boolean = false;
  clienteId: string = '';

  cliente = {
    nombre: '',
    telefono: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // Verificar si es edición
    this.route.paramMap.subscribe(params => {
      this.clienteId = params.get('id') || '';
      this.esEdicion = !!this.clienteId;

      if (this.esEdicion) {
        this.cargarCliente();
      }
    });
  }

  cargarCliente() {
    // Aquí cargarías el cliente desde la base de datos
    // Por ahora simulamos datos
    this.cliente = {
      nombre: 'Cliente Ejemplo',
      telefono: '+591 12345678'
    };
  }

  volver() {
    this.location.back();
  }

  guardarCliente() {
    // Validar que los campos requeridos estén llenos
    if (!this.cliente.nombre.trim()) {
      console.log('El nombre del cliente es requerido');
      return;
    }

    if (!this.cliente.telefono.trim()) {
      console.log('El teléfono del cliente es requerido');
      return;
    }

    // Aquí enviarías los datos a la base de datos
    console.log('Guardando cliente:', this.cliente);

    if (this.esEdicion) {
      console.log('Actualizando cliente existente');
      // Actualizar cliente existente
    } else {
      console.log('Creando nuevo cliente');
      // Crear nuevo cliente
    }

    // Volver a la página de clientes
    this.router.navigate(['/tabs/tab3']);
  }
}
