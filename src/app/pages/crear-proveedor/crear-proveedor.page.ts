import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
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
    private supabaseService: SupabaseService,
    private alertController: AlertController
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
      } else {
        await this.supabaseService.createProveedor(this.proveedor);
      }

      this.router.navigate(['/tabs/proveedores']);
    } catch (error) {
      console.error('Error guardando proveedor:', error);
      await this.mostrarAlerta('Error', 'No se pudo guardar el proveedor');
    } finally {
      this.loading = false;
    }
  }

  validarProveedor(): boolean {
    if (!this.proveedor.nombre.trim()) {
      this.mostrarAlerta('Error', 'El nombre del proveedor es requerido');
      return false;
    }

    if (!this.proveedor.telefono.trim()) {
      this.mostrarAlerta('Error', 'El teléfono del proveedor es requerido');
      return false;
    }

    if (!this.proveedor.ci.trim()) {
      this.mostrarAlerta('Error', 'El C.I. del proveedor es requerido');
      return false;
    }

    if (!this.proveedor.direccion.trim()) {
      this.mostrarAlerta('Error', 'La dirección del proveedor es requerida');
      return false;
    }

    if (!this.proveedor.ubicacion.trim()) {
      this.mostrarAlerta('Error', 'La ubicación del proveedor es requerida');
      return false;
    }

    return true;
  }

  // Confirmar eliminación del proveedor
  async confirmarEliminarProveedor() {
    const alert = await this.alertController.create({
      header: '¿Eliminar Proveedor?',
      message: '¿Estás seguro que deseas eliminar este proveedor? Esta acción no se puede deshacer.',
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
            this.eliminarProveedor();
          }
        }
      ]
    });

    await alert.present();
  }

  // Eliminar proveedor (eliminación lógica)
  async eliminarProveedor() {
    this.loading = true;

    try {
      await this.supabaseService.deleteProveedor(parseInt(this.proveedorId));

      const successAlert = await this.alertController.create({
        header: 'Proveedor Eliminado',
        message: 'El proveedor ha sido eliminado exitosamente',
        buttons: ['OK']
      });

      await successAlert.present();
      await successAlert.onDidDismiss();

      this.router.navigate(['/tabs/proveedores']);
    } catch (error) {
      console.error('Error eliminando proveedor:', error);
      await this.mostrarAlerta('Error', 'No se pudo eliminar el proveedor');
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
