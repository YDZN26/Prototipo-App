import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.page.html',
  styleUrls: ['./crear-cliente.page.scss'],
  standalone: false
})
export class CrearClientePage implements OnInit {

  esEdicion: boolean = false;
  clienteId: string = '';
  loading = false;

  cliente = {
    nombre: '',
    telefono: '',
    ci: '' // AGREGAR CI
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.clienteId = params.get('id') || '';
      this.esEdicion = !!this.clienteId;

      if (this.esEdicion) {
        this.cargarCliente();
      }
    });
  }

  async cargarCliente() {
    try {
      const clientes = await this.supabaseService.getClientes();
      const clienteData = clientes.find(c => c.id == this.clienteId);

      if (clienteData) {
        this.cliente = {
          nombre: clienteData.nombre,
          telefono: clienteData.telefono || '',
          ci: clienteData.ci || '' // AGREGAR CI
        };
      }
    } catch (error) {
      console.error('Error cargando cliente:', error);
    }
  }

  volver() {
    this.location.back();
  }

  async guardarCliente() {
    if (!this.validarCliente()) return;

    this.loading = true;

    try {
      if (this.esEdicion) {
        await this.supabaseService.updateCliente(parseInt(this.clienteId), this.cliente);
        console.log('Cliente actualizado');
      } else {
        await this.supabaseService.createCliente(this.cliente);
        console.log('Cliente creado');
      }

      this.router.navigate(['/tabs/tab3']);
    } catch (error) {
      console.error('Error guardando cliente:', error);
      alert('Error al guardar el cliente');
    } finally {
      this.loading = false;
    }
  }

  validarCliente(): boolean {
    if (!this.cliente.nombre.trim()) {
      alert('El nombre del cliente es requerido');
      return false;
    }

    if (!this.cliente.telefono.trim()) {
      alert('El teléfono del cliente es requerido');
      return false;
    }

    if (!this.cliente.ci.trim()) { // VALIDAR CI
      alert('La cédula de identidad del cliente es requerida');
      return false;
    }

    return true;
  }
}
