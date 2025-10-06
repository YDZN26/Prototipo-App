import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
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
    ci: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private supabaseService: SupabaseService,
    private alertController: AlertController
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
          ci: clienteData.ci || ''
        };
      }
    } catch (error) {
      console.error('Error cargando cliente:', error);
    }
  }

  volver() {
    this.location.back();
  }

  validarSoloNumeros(event: any) {
    const input = event.target;
    const valor = input.value;
    const soloNumeros = valor.replace(/\D/g, '');

    if (valor !== soloNumeros) {
      this.cliente.telefono = soloNumeros;
      input.value = soloNumeros;
    }
  }

  async guardarCliente() {
    if (!this.validarCliente()) return;

    this.loading = true;

    try {
      if (this.esEdicion) {
        await this.supabaseService.updateCliente(parseInt(this.clienteId), this.cliente);
      } else {
        await this.supabaseService.createCliente(this.cliente);
      }

      this.router.navigate(['/tabs/tab3']);
    } catch (error) {
      console.error('Error guardando cliente:', error);
      await this.mostrarAlerta('Error', 'No se pudo guardar el cliente');
    } finally {
      this.loading = false;
    }
  }

  validarCliente(): boolean {
    if (!this.cliente.nombre.trim()) {
      this.mostrarAlerta('Error', 'El nombre del cliente es requerido');
      return false;
    }

    if (!this.cliente.telefono.trim()) {
      this.mostrarAlerta('Error', 'El teléfono del cliente es requerido');
      return false;
    }

    if (!this.cliente.ci.trim()) {
      this.mostrarAlerta('Error', 'La cédula de identidad del cliente es requerida');
      return false;
    }

    return true;
  }

  // Confirmar eliminación del cliente
  async confirmarEliminarCliente() {
    const alert = await this.alertController.create({
      header: '¿Eliminar Cliente?',
      message: '¿Estás seguro que deseas eliminar este cliente? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: () => {
            this.eliminarCliente();
          }
        }
      ]
    });

    await alert.present();
  }

  // Eliminar cliente (eliminación lógica)
  async eliminarCliente() {
    this.loading = true;

    try {
      await this.supabaseService.deleteCliente(parseInt(this.clienteId));

      const successAlert = await this.alertController.create({
        header: 'Cliente Eliminado',
        message: 'El cliente ha sido eliminado exitosamente',
        buttons: ['OK']
      });

      await successAlert.present();
      await successAlert.onDidDismiss();

      this.router.navigate(['/tabs/tab3']);
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      await this.mostrarAlerta('Error', 'No se pudo eliminar el cliente');
    } finally {
      this.loading = false;
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}
