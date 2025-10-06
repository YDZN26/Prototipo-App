import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.page.html',
  styleUrls: ['./detalle-venta.page.scss'],
  standalone: false
})
export class DetalleVentaPage implements OnInit {

  venta: any = {
    productos: [],
    total: 0,
    clienteId: '',
    metodoPago: '',
    fecha: '',
    empleado_id: null
  };

  fechaFormateada: string = '';
  metodoPagoTexto: string = '';
  nombreEmpleado: string = '';
  nombreCliente: string = 'Cliente General';
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      if (params['ventaData']) {
        this.venta = JSON.parse(params['ventaData']);

        // ✅ Cargar el nombre del empleado que hizo la venta
        await this.cargarNombreEmpleado();

        // Si la venta tiene ID, obtener datos completos de Supabase
        if (this.venta.id) {
          await this.cargarDatosCompletos();
        } else {
          // Venta nueva, usar datos pasados
          await this.cargarNombreCliente();
          this.formatearDatos();
        }
      }
    });
  }

  // ✅ NUEVO: Método para cargar el nombre del empleado que hizo la venta
  async cargarNombreEmpleado() {
    const empleadoId = this.venta.empleado_id;

    if (empleadoId) {
      try {
        const empleados = await this.supabaseService.getEmpleados();
        const empleado = empleados.find(e => e.id === empleadoId);
        this.nombreEmpleado = empleado ? empleado.nombre : 'Empleado no encontrado';
      } catch (error) {
        console.error('Error cargando empleado:', error);
        this.nombreEmpleado = 'Error al cargar empleado';
      }
    } else {
      // Si no hay empleado_id, usar el usuario actual como fallback
      this.nombreEmpleado = localStorage.getItem('nombreUsuario') || 'Empleado';
    }
  }

  async cargarDatosCompletos() {
    this.loading = true;
    try {
      // Cargar nombre del cliente si existe clienteId
      await this.cargarNombreCliente();

      // Formatear los datos
      this.formatearDatos();
    } catch (error) {
      console.error('Error cargando datos completos:', error);
      this.formatearDatos();
    } finally {
      this.loading = false;
    }
  }

  async cargarNombreCliente() {
    const clienteId = this.venta.clienteId || this.venta.cliente_id;

    if (clienteId) {
      try {
        const clientes = await this.supabaseService.getClientes();
        const cliente = clientes.find(c => c.id === clienteId);
        this.nombreCliente = cliente ? cliente.nombre : 'Cliente General';
      } catch (error) {
        console.error('Error cargando cliente:', error);
        this.nombreCliente = 'Cliente General';
      }
    } else {
      this.nombreCliente = 'Cliente General';
    }
  }

  formatearDatos() {
    // Formatear fecha y hora
    const fecha = new Date(this.venta.fecha);

    const hora = fecha.toLocaleTimeString('es-BO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();

    this.fechaFormateada = `${hora} | ${dia}/${mes}/${año}`;

    // Formatear método de pago
    switch (this.venta.metodoPago || this.venta.metodo_pago) {
      case 'efectivo':
        this.metodoPagoTexto = 'Efectivo';
        break;
      case 'tarjeta':
        this.metodoPagoTexto = 'Tarjeta';
        break;
      case 'transferencia':
        this.metodoPagoTexto = 'Transferencia';
        break;
      default:
        this.metodoPagoTexto = 'No especificado';
    }
  }

  volverInicio() {
    this.router.navigate(['/tabs/tab1']);
  }
}
