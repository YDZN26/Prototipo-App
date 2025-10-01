import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit {

  userRole: string = '';

  constructor() {}

  ngOnInit() {
    // Cargar el rol del usuario desde localStorage
    this.userRole = localStorage.getItem('userRole') || '';
    console.log('Rol del usuario:', this.userRole);
  }

  // Verificar si el usuario es administrador
  isAdmin(): boolean {
    return this.userRole === 'administrador';
  }

  // Verificar si el usuario es vendedor
  isVendedor(): boolean {
    return this.userRole === 'vendedor';
  }
}