import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-crear-proveedor',
  templateUrl: './crear-proveedor.page.html',
  styleUrls: ['./crear-proveedor.page.scss'],
  standalone: false
})
export class CrearProveedorPage implements OnInit {

  esEdicion: boolean = false;
  proveedorId: string = '';
  loading = false;

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
    private location: Location,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.proveedorId = params.get('id') || '';
      this.esEdicion = !!this.proveedorId;
      
      if (this.esEdicion) {
        this.cargarProveedor();
      }
    });
  }

  async cargarProveedor() {
    try {
      const proveedores = await this.supabaseService.getProveedores();
      const proveedorData = proveedores.find(p => p.id == this.proveedorId);
      
      if (proveedorData) {
        this.proveedor = {
          nombre: proveedorData.nombre,
          telefono: proveedorData.telefono || '',
          ci: proveedorData.ci || '',
          direccion: proveedorData.direccion || '',
          ubicacion: proveedorData.ubicacion || ''
        };
      }
    } catch (error) {
      console.error('Error cargando proveedor:', error);
    }
  }

  volver() {
    this.location.back();
  }

  async guardarProveedor() {
    if (!this.validarProveedor()) return;

    this.loading = true;

    try {
      if (this.esEdicion) {
        await this.supabaseService.updateProveedor(parseInt(this.proveedorId), this.proveedor);
        console.log('Proveedor actualizado');
      } else {
        await this.supabaseService.createProveedor(this.proveedor);
        console.log('Proveedor creado');
      }

      this.router.navigate(['/tabs/proveedores']);
    } catch (error) {
      console.error('Error guardando proveedor:', error);
      alert('Error al guardar el proveedor');
    } finally {
      this.loading = false;
    }
  }

  validarProveedor(): boolean {
    if (!this.proveedor.nombre.trim()) {
      alert('El nombre del proveedor es requerido');
      return false;
    }

    if (!this.proveedor.telefono.trim()) {
      alert('El teléfono del proveedor es requerido');
      return false;
    }

    if (!this.proveedor.ci.trim()) {
      alert('El C.I. del proveedor es requerido');
      return false;
    }

    if (!this.proveedor.direccion.trim()) {
      alert('La dirección del proveedor es requerida');
      return false;
    }

    if (!this.proveedor.ubicacion.trim()) {
      alert('La ubicación del proveedor es requerida');
      return false;
    }

    return true;
  }
}