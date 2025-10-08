import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.page.html',
  styleUrls: ['./reporte-ventas.page.scss'],
  standalone: false
})
export class ReporteVentasPage implements OnInit {

  tituloFecha: string = '';
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  
  ventas: any[] = [];
  loading = false;

  // Resumen
  totalVentas = 0;
  totalEfectivo = 0;
  totalTransferencia = 0;
  totalTarjeta = 0;
  cantidadVentas = 0;

  // Fecha de generación del reporte
  fechaGeneracion: string = '';
  horaGeneracion: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService
  ) {
    // Inicializar fecha y hora de generación
    const ahora = new Date();
    this.fechaGeneracion = ahora.toLocaleDateString('es-BO');
    this.horaGeneracion = ahora.toLocaleTimeString('es-BO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      if (params['fechaInicio'] && params['fechaFin']) {
        this.fechaInicio = new Date(params['fechaInicio']);
        this.fechaFin = new Date(params['fechaFin']);
        this.tituloFecha = params['tituloFecha'] || 'Reporte de Ventas';
        
        const userRole = params['userRole'];
        const userId = parseInt(params['userId'] || '0');
        
        await this.cargarVentas(userRole, userId);
      }
    });
  }

  async cargarVentas(userRole: string, userId: number) {
    this.loading = true;
    try {
      const todasLasVentas = await this.supabaseService.getVentasPorFecha(
        this.fechaInicio.toISOString(),
        this.fechaFin.toISOString()
      );

      // Filtrar por fechas exactas
      let ventasFiltradas = todasLasVentas.filter(venta => {
        const fechaVenta = new Date(venta.fecha);
        return fechaVenta >= this.fechaInicio && fechaVenta <= this.fechaFin;
      });

      // Filtrar por usuario si es vendedor
      if (userRole === 'vendedor') {
        ventasFiltradas = ventasFiltradas.filter(v => v.empleado_id === userId);
      }

      // Procesar ventas
      this.ventas = await this.procesarVentas(ventasFiltradas);
      this.calcularResumen();

    } catch (error) {
      console.error('Error cargando ventas:', error);
    } finally {
      this.loading = false;
    }
  }

  async procesarVentas(ventas: any[]) {
    return ventas.map(venta => {
      const fechaVenta = new Date(venta.fecha);
      
      const hora = fechaVenta.toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      const fechaStr = fechaVenta.toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const productos = venta.venta_productos || [];
      const nombreCliente = venta.clientes?.nombre || 'Cliente General';
      const nombreEmpleado = venta.empleados?.nombre || 'Sin empleado';

      return {
        id: venta.id,
        fecha: fechaStr,
        hora: hora,
        cliente: nombreCliente,
        empleado: nombreEmpleado,
        metodoPago: this.formatearMetodoPago(venta.metodo_pago),
        total: parseFloat(venta.total),
        productos: productos.map((p: any) => ({
          nombre: p.productos?.nombre || 'Producto',
          cantidad: p.cantidad,
          precio: p.precio_unitario,
          subtotal: p.subtotal
        }))
      };
    });
  }

  calcularResumen() {
    this.cantidadVentas = this.ventas.length;
    this.totalVentas = 0;
    this.totalEfectivo = 0;
    this.totalTransferencia = 0;
    this.totalTarjeta = 0;

    this.ventas.forEach(venta => {
      this.totalVentas += venta.total;

      switch (venta.metodoPago) {
        case 'Efectivo':
          this.totalEfectivo += venta.total;
          break;
        case 'Transferencia':
          this.totalTransferencia += venta.total;
          break;
        case 'Tarjeta':
          this.totalTarjeta += venta.total;
          break;
      }
    });
  }

  formatearMetodoPago(metodo: string): string {
    switch (metodo) {
      case 'efectivo': return 'Efectivo';
      case 'transferencia': return 'Transferencia';
      case 'tarjeta': return 'Tarjeta';
      default: return metodo;
    }
  }

  volver() {
    this.router.navigate(['/tabs/tab1']);
  }

  imprimir() {
    window.print();
  }
}