import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { IonModal, AlertController } from '@ionic/angular';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-nueva-venta',
  templateUrl: './nueva-venta.page.html',
  styleUrls: ['./nueva-venta.page.scss'],
  standalone: false
})
export class NuevaVentaPage implements OnInit {

  @ViewChild('modalClientes', { static: false }) modalClientes!: IonModal;
  @ViewChild('modalNuevoCliente', { static: false }) modalNuevoCliente!: IonModal;

  venta: {
    clienteId: string;
    metodoPago: string;
  } = {
    clienteId: '',
    metodoPago: ''
  };

  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  clienteSeleccionadoNombre: string = '';
  busquedaCliente: string = '';

  modalClientesAbierto: boolean = false;
  modalNuevoClienteAbierto: boolean = false;
  guardandoCliente: boolean = false;

  nuevoCliente = {
    nombre: '',
    telefono: ''
  };

  metodosPago = [
    { id: 'efectivo', nombre: 'Efectivo', icono: 'cash-outline' },
    { id: 'tarjeta', nombre: 'Tarjeta', icono: 'card-outline' },
    { id: 'transferencia', nombre: 'Transferencia', icono: 'business-outline' }
  ];

  constructor(
    private router: Router,
    private location: Location,
    private supabaseService: SupabaseService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.cargarClientes();
  }

  async cargarClientes() {
    try {
      this.clientes = await this.supabaseService.getClientes();
      this.clientesFiltrados = [...this.clientes];
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  }

  volver() {
    this.location.back();
  }

  // Modal de clientes
  abrirModalClientes() {
    this.modalClientesAbierto = true;
    this.busquedaCliente = '';
    this.clientesFiltrados = [...this.clientes];
  }

  cerrarModalClientes() {
    this.modalClientesAbierto = false;
  }

  filtrarClientes() {
    const termino = this.busquedaCliente.toLowerCase().trim();

    if (!termino) {
      this.clientesFiltrados = [...this.clientes];
      return;
    }

    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(termino) ||
      (cliente.telefono && cliente.telefono.includes(termino))
    );
  }

  seleccionarCliente(cliente: any) {
    this.venta.clienteId = cliente.id.toString();
    this.clienteSeleccionadoNombre = cliente.nombre;
    this.cerrarModalClientes();
  }

  // Modal nuevo cliente
  abrirFormularioNuevoCliente() {
    this.modalClientesAbierto = false;
    this.modalNuevoClienteAbierto = true;
    this.nuevoCliente = { nombre: '', telefono: '' };
  }

  cerrarModalNuevoCliente() {
    this.modalNuevoClienteAbierto = false;
    this.modalClientesAbierto = true;
  }

  async guardarNuevoCliente() {
    if (!this.nuevoCliente.nombre || !this.nuevoCliente.telefono) {
      return;
    }

    this.guardandoCliente = true;

    try {
      const clienteCreado = await this.supabaseService.createCliente(this.nuevoCliente);

      // Agregar el nuevo cliente a la lista
      this.clientes.push(clienteCreado[0]);
      this.clientesFiltrados = [...this.clientes];

      // Seleccionar automáticamente el cliente recién creado
      this.seleccionarCliente(clienteCreado[0]);

      // Cerrar modal
      this.modalNuevoClienteAbierto = false;

      // Mostrar mensaje de éxito
      this.mostrarAlerta('Éxito', 'Cliente creado correctamente');
    } catch (error) {
      console.error('Error creando cliente:', error);
      this.mostrarAlerta('Error', 'No se pudo crear el cliente');
    } finally {
      this.guardandoCliente = false;
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

  // Método de pago
  seleccionarMetodoPago(metodoId: string) {
    this.venta.metodoPago = metodoId;
  }

  puedesContinuar(): boolean {
    return !!(this.venta.clienteId && this.venta.metodoPago);
  }

  continuarASeleccion() {
    if (!this.puedesContinuar()) {
      return;
    }

    // Guardar datos de venta en localStorage temporalmente
    localStorage.setItem('ventaTemporal', JSON.stringify(this.venta));

    // Navegar a seleccionar productos
    this.router.navigate(['/seleccionar-productos']);
  }
}
