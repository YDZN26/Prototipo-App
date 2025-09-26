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
    fecha: ''
  };

  fechaFormateada: string = '';
  metodoPagoTexto: string = '';
  nombreEmpleado: string = 'NombreEmpleado';
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
        
        // Si la venta tiene ID, obtener datos completos de Supabase
        if (this.venta.id) {
          await this.cargarVentaCompleta(this.venta.id);
        } else {
          // Venta nueva, usar datos pasados
          this.formatearDatos();
        }
      }
    });
  }

  async cargarVentaCompleta(ventaId: number) {
    this.loading = true;
    try {
      // Obtener venta completa con empleado
      const ventaCompleta = await this.supabaseService.getVentaPorId(ventaId);
      
      if (ventaCompleta) {
        this.venta = {
          ...this.venta,
          ...ventaCompleta,
          productos: ventaCompleta.venta_productos.map((vp: any) => ({
            id: vp.producto_id,
            nombre: vp.productos?.nombre || 'Producto',
            cantidad: vp.cantidad,
            precioUnitario: vp.precio_unitario,
            subtotal: vp.subtotal
          }))
        };

        // Obtener nombre del empleado
        if (ventaCompleta.empleado_id) {
          const empleados = await this.supabaseService.getEmpleados();
          const empleado = empleados.find(e => e.id === ventaCompleta.empleado_id);
          this.nombreEmpleado = empleado ? empleado.nombre : 'Empleado Desconocido';
        }
      }

      this.formatearDatos();
    } catch (error) {
      console.error('Error cargando venta completa:', error);
      this.formatearDatos(); // Usar datos disponibles
    } finally {
      this.loading = false;
    }
  }

  formatearDatos() {
    // Formatear fecha y hora
    const fecha = new Date(this.venta.fecha);
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const ampm = fecha.getHours() >= 12 ? 'pm' : 'am';
    const horaFormateada = fecha.getHours() > 12 ? 
      `${(fecha.getHours() - 12).toString().padStart(2, '0')}:${minutos}` : 
      `${horas}:${minutos}`;
    
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    
    this.fechaFormateada = `${horaFormateada} ${ampm} | ${dia}/${mes}/${año}`;

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

    // Si no tenemos nombre de empleado, usar el del localStorage
    if (this.nombreEmpleado === 'NombreEmpleado') {
      const nombreGuardado = localStorage.getItem('nombreUsuario');
      this.nombreEmpleado = nombreGuardado || 'Empleado';
    }
  }

  volverInicio() {
    this.router.navigate(['/tabs/tab1']);
  }
}