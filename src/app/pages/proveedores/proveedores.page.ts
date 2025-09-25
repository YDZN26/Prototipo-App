import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.page.html',
  styleUrls: ['./proveedores.page.scss'],
  standalone: false
})
export class ProveedoresPage implements OnInit {

  nombreUsuario: string = 'NombreUsuario';
  mostrarCampoBusqueda = false;
  textoBusqueda: string = '';

  proveedores = [
    {
      id: 1,
      nombre: 'NombreProveedor',
      telefono: 'Telefono',
      direccion: 'Dirección',
      ci: 'C.I.'
    },
    {
      id: 2,
      nombre: 'NombreProveedor',
      telefono: 'Telefono',
      direccion: 'Dirección',
      ci: 'C.I.'
    },
    {
      id: 3,
      nombre: 'NombreProveedor',
      telefono: 'Telefono',
      direccion: 'Dirección',
      ci: 'C.I.'
    },
    {
      id: 4,
      nombre: 'NombreProveedor',
      telefono: 'Telefono',
      direccion: 'Dirección',
      ci: 'C.I.'
    }
  ];

  filteredProveedores = this.proveedores;

  constructor(private router: Router) {}

  ngOnInit() {
    this.filtrarProveedores();
  }

  filtrarProveedores() {
    if (this.textoBusqueda.trim() === '') {
      this.filteredProveedores = this.proveedores;
      return;
    }

    const texto = this.textoBusqueda.toLowerCase();
    this.filteredProveedores = this.proveedores.filter(proveedor =>
      proveedor.nombre.toLowerCase().includes(texto) ||
      proveedor.telefono.toLowerCase().includes(texto) ||
      proveedor.direccion.toLowerCase().includes(texto) ||
      proveedor.ci.toLowerCase().includes(texto)
    );
  }

  editarProveedor(proveedor: any) {
    // Navegar a página de editar proveedor
    console.log('Editar proveedor:', proveedor);
    this.router.navigate(['/editar-proveedor', proveedor.id]);
  }

  crearProveedor() {
    // Navegar a página de crear proveedor
    console.log('Crear nuevo proveedor');
    this.router.navigate(['/crear-proveedor']);
  }
}
