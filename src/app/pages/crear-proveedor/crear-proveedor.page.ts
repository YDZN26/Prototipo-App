import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-crear-proveedor',
  templateUrl: './crear-proveedor.page.html',
  styleUrls: ['./crear-proveedor.page.scss'],
  standalone: false
})
export class CrearProveedorPage implements OnInit {

  esEdicion: boolean = false;
  proveedorId: string = '';

  proveedor = {
    nombre: '',
    telefono: '',
    ci: '',
    direccion: '',
    ubicacion: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // Verificar si es edición
    this.route.paramMap.subscribe(params => {
      this.proveedorId = params.get('id') || '';
      this.esEdicion = !!this.proveedorId;

      if (this.esEdicion) {
        this.cargarProveedor();
      }
    });
  }

  cargarProveedor() {
    // Aquí cargarías el proveedor desde la base de datos
    // Por ahora simulamos datos
    this.proveedor = {
      nombre: 'Proveedor Ejemplo',
      telefono: '+591 12345678',
      ci: '12345678 LP',
      direccion: 'Calle Ejemplo #123',
      ubicacion: 'Zona Norte, La Paz'
    };
  }

  volver() {
    this.location.back();
  }

  guardarProveedor() {
    // Validar que los campos requeridos estén llenos
    if (!this.proveedor.nombre.trim()) {
      console.log('El nombre del proveedor es requerido');
      return;
    }

    if (!this.proveedor.telefono.trim()) {
      console.log('El teléfono del proveedor es requerido');
      return;
    }

    if (!this.proveedor.ci.trim()) {
      console.log('El C.I. del proveedor es requerido');
      return;
    }

    if (!this.proveedor.direccion.trim()) {
      console.log('La dirección del proveedor es requerida');
      return;
    }

    if (!this.proveedor.ubicacion.trim()) {
      console.log('La ubicación del proveedor es requerida');
      return;
    }

    // Aquí enviarías los datos a la base de datos
    console.log('Guardando proveedor:', this.proveedor);

    if (this.esEdicion) {
      console.log('Actualizando proveedor existente');
      // Actualizar proveedor existente
    } else {
      console.log('Creando nuevo proveedor');
      // Crear nuevo proveedor
    }

    // Volver a la página de proveedores
    this.router.navigate(['/tabs/proveedores']);
  }
}
