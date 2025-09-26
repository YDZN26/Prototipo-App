import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, AlertController } from '@ionic/angular'; // AGREGAR AlertController
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page {

  @ViewChild('modalCalendario', { static: false }) modalCalendario!: IonModal;

  nombreUsuario: string = 'Usuario';
  days: any[] = [];
  selectedDay: string = '';
  fechaActualISO = new Date().toISOString();

  mostrarCampoBusqueda = false;
  textoBusqueda: string = '';
  loading = false;

  salesData = {
    efectivo: 0,
    transferencia: 0,
    tarjeta: 0,
    total: 0
  };

  recentProducts: any[] = [];
  filteredProducts: any[] = [];

  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private alertController: AlertController // AGREGAR ESTO
  ) {}

  ngOnInit() {
    // Generar días históricos
    this.generarDiasHistoricos(30);

    // Seleccionar día actual
    const fecha = new Date();
    const day = fecha.getDate();
    const mes = fecha.toLocaleString('es-BO', { month: 'long' });
    this.selectedDay = `${day} de ${mes}`;

    // Cargar nombre de usuario del localStorage
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    if (nombreGuardado) {
      this.nombreUsuario = nombreGuardado;
    }

    // Cargar ventas del día
    this.cargarVentasDelDia();
  }

  // ========================
  // NUEVAS FUNCIONES PARA CERRAR SESIÓN
  // ========================

  async mostrarOpcionesUsuario(event: any) {
    const alert = await this.alertController.create({
      header: this.nombreUsuario,
      message: '¿Qué deseas hacer?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Cerrar Sesión',
          cssClass: 'danger',
          handler: () => {
            this.confirmarCerrarSesion();
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmarCerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Cerrar Sesión',
          cssClass: 'danger',
          handler: () => {
            this.cerrarSesion();
          }
        }
      ]
    });

    await alert.present();
  }

  cerrarSesion() {
    // Limpiar datos del localStorage
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    
    // Navegar al login
    this.router.navigate(['/login']);
  }

  // ========================
  // TUS FUNCIONES EXISTENTES (sin cambios)
  // ========================

  async cargarVentasDelDia() {
    this.loading = true;
    try {
      // Calcular fechas del día seleccionado
      const fechas = this.calcularFechasDelDia(this.selectedDay);
      
      // Obtener ventas de Supabase
      const ventas = await this.supabaseService.getVentasPorFecha(
        fechas.inicio, 
        fechas.fin
      );

      // Procesar datos para el resumen de ventas
      this.procesarResumenVentas(ventas);
      
      // Procesar datos para la lista de productos recientes
      this.procesarVentasRecientes(ventas);
      
    } catch (error) {
      console.error('Error cargando ventas:', error);
    } finally {
      this.loading = false;
    }
  }

  calcularFechasDelDia(dayString: string) {
    // Extraer día y mes del string
    const partes = dayString.split(' ');
    const dia = parseInt(partes[0]);
    const mesStr = partes[2];
    
    const meses: { [key: string]: number } = {
      enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
      julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
    };
    
    const mes = meses[mesStr.toLowerCase()];
    const year = new Date().getFullYear();
    
    // Crear fechas en zona horaria local
    const fechaSeleccionada = new Date(year, mes, dia);
    
    // Inicio del día en Bolivia (00:00:00)
    const inicioBolivia = new Date(fechaSeleccionada);
    inicioBolivia.setHours(0, 0, 0, 0);
    
    // Fin del día en Bolivia (23:59:59)
    const finBolivia = new Date(fechaSeleccionada);
    finBolivia.setHours(23, 59, 59, 999);
    
    // IMPORTANTE: Ajustar a la misma zona horaria que se usa al guardar
    // Restar 4 horas para que coincida con cómo guardamos en createVenta
    const inicioAjustado = new Date(inicioBolivia.getTime() - (4 * 60 * 60 * 1000));
    const finAjustado = new Date(finBolivia.getTime() - (4 * 60 * 60 * 1000));
    
    return { 
      inicio: inicioAjustado.toISOString(),
      fin: finAjustado.toISOString()
    };
  }

  procesarResumenVentas(ventas: any[]) {
    // Resetear totales
    this.salesData = {
      efectivo: 0,
      transferencia: 0,
      tarjeta: 0,
      total: 0
    };

    // Sumar por método de pago
    ventas.forEach(venta => {
      const total = parseFloat(venta.total);
      this.salesData.total += total;

      switch (venta.metodo_pago) {
        case 'efectivo':
          this.salesData.efectivo += total;
          break;
        case 'transferencia':
          this.salesData.transferencia += total;
          break;
        case 'tarjeta':
          this.salesData.tarjeta += total;
          break;
      }
    });
  }

  procesarVentasRecientes(ventas: any[]) {
    this.recentProducts = ventas.map(venta => {
      // La fecha viene de la BD ya ajustada a Bolivia, pero necesitamos mostrarla correctamente
      const fechaBD = new Date(venta.fecha);
      // Sumar 4 horas para mostrar la hora local real
      const fechaLocal = new Date(fechaBD.getTime() + (4 * 60 * 60 * 1000));
      
      const hora = fechaLocal.toLocaleTimeString('es-BO', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
      
      const fechaStr = fechaLocal.toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      // Obtener nombres de productos
      const productos = venta.venta_productos || [];
      const nombreProductos = productos.length > 0 
        ? productos.map((p: any) => p.productos?.nombre).filter(Boolean).slice(0, 2).join(', ')
        : 'Sin productos';

      return {
        id: venta.id,
        name: nombreProductos,
        type: this.formatearMetodoPago(venta.metodo_pago),
        time: `${fechaStr} - ${hora}`,
        price: venta.total,
        ventaCompleta: {
          id: venta.id,
          fecha: venta.fecha,
          clienteId: venta.cliente_id,
          metodoPago: venta.metodo_pago,
          total: venta.total,
          productos: productos.map((p: any) => ({
            id: p.producto_id,
            nombre: p.productos?.nombre || 'Producto',
            cantidad: p.cantidad,
            precioUnitario: p.precio_unitario,
            subtotal: p.subtotal
          }))
        }
      };
    });

    this.filteredProducts = this.recentProducts;
  }

  formatearMetodoPago(metodo: string): string {
    switch (metodo) {
      case 'efectivo': return 'Efectivo';
      case 'transferencia': return 'Transferencia';
      case 'tarjeta': return 'Tarjeta';
      default: return metodo;
    }
  }

  generarDiasHistoricos(cantidadDias: number = 30) {
    const dias: any[] = [];
    for (let i = cantidadDias - 1; i >= 0; i--) {
      const f = new Date();
      f.setDate(f.getDate() - i);
      const d = f.getDate();
      const m = f.toLocaleString('es-BO', { month: 'long' });
      dias.push({
        label: `${d} de ${m}`,
        value: `${d} de ${m}`
      });
    }
    this.days = dias;
  }

  async onDaySelected(dayString: string | null) {
    if (!dayString) return;
    this.selectedDay = dayString;
    await this.cargarVentasDelDia();
  }

  filtrarItems() {
    const texto = this.textoBusqueda.toLowerCase().trim();

    if (!texto) {
      this.filteredProducts = this.recentProducts;
      return;
    }

    this.filteredProducts = this.recentProducts.filter(product =>
      product.name.toLowerCase().includes(texto) ||
      product.type.toLowerCase().includes(texto)
    );
  }

  async seleccionarFechaDesdeCalendario(event: any) {
    const fechaSeleccionada = new Date(event.detail.value);
    const dia = fechaSeleccionada.getDate();
    const mes = fechaSeleccionada.toLocaleString('es-BO', { month: 'long' });

    this.selectedDay = `${dia} de ${mes}`;
    await this.cargarVentasDelDia();
  }

  registerSale() {
    this.router.navigate(['/seleccionar-productos']);
  }

  verDetalleVenta(venta: any) {
    this.router.navigate(['/detalle-venta'], {
      queryParams: {
        ventaData: JSON.stringify(venta.ventaCompleta)
      }
    });
  }

  async ionViewWillEnter() {
    // Recargar datos cuando se vuelve al dashboard
    await this.cargarVentasDelDia();
  }
}