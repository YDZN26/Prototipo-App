import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { IonModal } from '@ionic/angular';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-nueva-venta',
  templateUrl: './nueva-venta.page.html',
  styleUrls: ['./nueva-venta.page.scss'],
  standalone: false
})
export class NuevaVentaPage implements OnInit {

  @ViewChild('modalFecha', { static: false }) modalFecha!: IonModal;

  fechaVenta: string = '';
  fechaVentaISO: string = new Date().toISOString();
  conceptoVenta: string = '';
  loading = false;

  venta: {
    clienteId: string;
    metodoPago: string;
    total: number;
    productos: any[];
  } = {
    clienteId: '',
    metodoPago: '',
    total: 0,
    productos: []
  };

  clientes: any[] = [];

  metodosPago = [
    { id: 'efectivo', nombre: 'Efectivo', icono: 'cash-outline' },
    { id: 'tarjeta', nombre: 'Tarjeta', icono: 'card-outline' },
    { id: 'transferencia', nombre: 'Transferencia', icono: 'business-outline' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    // Establecer fecha actual
    const hoy = new Date();
    this.fechaVenta = `Hoy, ${hoy.getDate()} ${hoy.toLocaleDateString('es-ES', { month: 'long' })}`;
    
    // Cargar clientes desde Supabase
    await this.cargarClientes();
    
    // Obtener productos del carrito si vienen de confirmación
    this.route.queryParams.subscribe(params => {
      if (params['productos']) {
        this.venta.productos = JSON.parse(params['productos']);
        this.venta.total = parseFloat(params['total']) || 0;
        this.actualizarConcepto();
      } else {
        this.actualizarConcepto();
      }
    });
  }

  async cargarClientes() {
    try {
      this.clientes = await this.supabaseService.getClientes();
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  }

  volver() {
    this.location.back();
  }

  seleccionarMetodoPago(metodoId: string) {
    this.venta.metodoPago = metodoId;
  }

  cambiarFecha(event: any) {
    const fechaSeleccionada = new Date(event.detail.value);
    const hoy = new Date();

    // Formatear la fecha
    if (fechaSeleccionada.toDateString() === hoy.toDateString()) {
      this.fechaVenta = `Hoy, ${fechaSeleccionada.getDate()} ${fechaSeleccionada.toLocaleDateString('es-ES', { month: 'long' })}`;
    } else {
      this.fechaVenta = fechaSeleccionada.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long'
      });
    }

    this.fechaVentaISO = fechaSeleccionada.toISOString();
  }

  actualizarConcepto() {
    const productosCount = this.venta.productos.length;
    
    if (productosCount === 0) {
      this.conceptoVenta = '0 NombreProducto, 0 NombreProducto';
    } else if (productosCount === 1) {
      const producto = this.venta.productos[0] as any;
      this.conceptoVenta = `1 ${producto.nombre}`;
    } else {
      const nombres = (this.venta.productos as any[]).map(p => p.nombre).slice(0, 2);
      this.conceptoVenta = `${productosCount} productos: ${nombres.join(', ')}`;
    }
  }

  puedeCrearVenta(): boolean {
    return !!(this.venta.clienteId && this.venta.metodoPago && this.venta.productos.length > 0);
  }

  async finalizarVenta() {
    if (!this.puedeCrearVenta()) {
      alert('Faltan datos requeridos para finalizar la venta');
      return;
    }

    this.loading = true;

    try {
      // Crear la venta en Supabase
      const ventaFinal = {
        fecha: this.fechaVentaISO,
        clienteId: parseInt(this.venta.clienteId),
        metodoPago: this.venta.metodoPago,
        productos: this.venta.productos,
        total: this.venta.total
      };

      const ventaCreada = await this.supabaseService.createVenta(ventaFinal);
      
      console.log('Venta creada exitosamente:', ventaCreada);
      
      // Navegar al detalle de venta
      this.router.navigate(['/detalle-venta'], {
        queryParams: {
          ventaData: JSON.stringify({
            ...ventaFinal,
            id: ventaCreada.id
          })
        }
      });
    } catch (error) {
      console.error('Error creando venta:', error);
      alert('Error al crear la venta. Intenta nuevamente.');
    } finally {
      this.loading = false;
    }
  }
}