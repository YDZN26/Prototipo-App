import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page implements OnInit {

  nombreUsuario: string = 'NombreUsuario';
  mostrarCampoBusqueda = false;
  textoBusqueda: string = '';

  clientes = [
    {
      id: 1,
      nombre: 'NombreCliente',
      telefono: 'Telefono'
    },
    {
      id: 2,
      nombre: 'NombreCliente',
      telefono: 'Telefono'
    },
    {
      id: 3,
      nombre: 'NombreCliente',
      telefono: 'Telefono'
    },
    {
      id: 4,
      nombre: 'NombreCliente',
      telefono: 'Telefono'
    },
    {
      id: 5,
      nombre: 'NombreCliente',
      telefono: 'Telefono'
    },
    {
      id: 6,
      nombre: 'NombreCliente',
      telefono: 'Telefono'
    }
  ];

  filteredClientes = this.clientes;

  constructor(private router: Router) {}

  ngOnInit() {
    this.filtrarClientes();
  }

  filtrarClientes() {
    if (this.textoBusqueda.trim() === '') {
      this.filteredClientes = this.clientes;
      return;
    }

    const texto = this.textoBusqueda.toLowerCase();
    this.filteredClientes = this.clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(texto) ||
      cliente.telefono.toLowerCase().includes(texto)
    );
  }

  editarCliente(cliente: any) {
    // Navegar a página de editar cliente
    console.log('Editar cliente:', cliente);
    this.router.navigate(['/editar-cliente', cliente.id]);
  }

  crearCliente() {
    // Navegar a página de crear cliente
    console.log('Crear nuevo cliente');
    this.router.navigate(['/crear-cliente']);
  }
}
