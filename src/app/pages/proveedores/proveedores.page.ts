import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

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

  proveedores: any[] = [];
  filteredProveedores: any[] = [];
  loading = false;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    await this.cargarProveedores();
  }

  async cargarProveedores() {
    this.loading = true;
    try {
      const data = await this.supabaseService.getProveedores();
      this.proveedores = data;
      this.filtrarProveedores();
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    } finally {
      this.loading = false;
    }
  }

  filtrarProveedores() {
    if (this.textoBusqueda.trim() === '') {
      this.filteredProveedores = this.proveedores;
      return;
    }

    const texto = this.textoBusqueda.toLowerCase();
    this.filteredProveedores = this.proveedores.filter(proveedor =>
      proveedor.nombre.toLowerCase().includes(texto) ||
      proveedor.telefono?.toLowerCase().includes(texto) ||
      proveedor.direccion?.toLowerCase().includes(texto) ||
      proveedor.ci?.toLowerCase().includes(texto)
    );
  }

  editarProveedor(proveedor: any) {
    this.router.navigate(['/editar-proveedor', proveedor.id]);
  }

  crearProveedor() {
    this.router.navigate(['/crear-proveedor']);
  }

  async ionViewWillEnter() {
    await this.cargarProveedores();
  }
}