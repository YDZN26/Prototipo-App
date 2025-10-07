import { Component, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IonModal, AlertController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page {

  @ViewChild('modalFiltroFechas', { static: false }) modalFiltroFechas!: IonModal;

  nombreUsuario: string = 'Usuario';
  tituloFecha: string = 'HOY';
  tituloResumen: string = 'Ventas de Hoy';

  mostrarCampoBusqueda = false;
  textoBusqueda: string = '';
  loading = false;
  mostrandoHoy: boolean = true;

  fechaInicioActual: Date = new Date();
  fechaFinActual: Date = new Date();
  fechaInicioPersonalizada: string = new Date().toISOString();
  fechaFinPersonalizada: string = new Date().toISOString();

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
    private alertController: AlertController
  ) {
    // Escuchar eventos de navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Si la URL contiene /tab1, recargar ventas
      if (event.url.includes('/tab1') || event.url.includes('/tabs/tab1')) {
        console.log('🔄 Navegación detectada a tab1, recargando ventas...');
        this.cargarVentas();
      }
    });
  }

  ngOnInit() {
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    if (nombreGuardado) {
      this.nombreUsuario = nombreGuardado;
    }
    this.filtrarHoy();
  }

  private formatearFechaCorta(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    return `${dia}/${mes}`;
  }

  filtrarHoy() {
    const hoy = new Date();
    this.fechaInicioActual = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0, 0);
    this.fechaFinActual = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999);

    const fechaCorta = this.formatearFechaCorta(hoy);
    this.tituloFecha = `HOY - ${fechaCorta}`;
    this.tituloResumen = 'Ventas de Hoy';
    this.mostrandoHoy = true;

    this.cargarVentas();
  }

  filtrarAyer() {
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);

    this.fechaInicioActual = new Date(ayer.getFullYear(), ayer.getMonth(), ayer.getDate(), 0, 0, 0, 0);
    this.fechaFinActual = new Date(ayer.getFullYear(), ayer.getMonth(), ayer.getDate(), 23, 59, 59, 999);

    const fechaCorta = this.formatearFechaCorta(ayer);
    this.tituloFecha = `AYER - ${fechaCorta}`;
    this.tituloResumen = 'Ventas de Ayer';
    this.mostrandoHoy = false;

    this.cargarVentas();
  }

  filtrarEstaSemana() {
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    const diferencia = diaSemana === 0 ? 6 : diaSemana - 1;

    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - diferencia);
    inicioSemana.setHours(0, 0, 0, 0);

    this.fechaInicioActual = inicioSemana;
    this.fechaFinActual = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999);

    const fechaInicioCorta = this.formatearFechaCorta(inicioSemana);
    const fechaFinCorta = this.formatearFechaCorta(hoy);
    this.tituloFecha = `SEMANA - ${fechaInicioCorta}/${fechaFinCorta}`;
    this.tituloResumen = 'Ventas de Esta Semana';
    this.mostrandoHoy = false;

    this.cargarVentas();
  }

  filtrarEsteMes() {
    const hoy = new Date();
    this.fechaInicioActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1, 0, 0, 0, 0);
    this.fechaFinActual = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999);

    const nombreMes = hoy.toLocaleString('es-BO', { month: 'short' }).toUpperCase();
    this.tituloFecha = `${nombreMes} ${hoy.getFullYear()}`;
    this.tituloResumen = `Ventas de ${nombreMes}`;
    this.mostrandoHoy = false;

    this.cargarVentas();
  }

  filtrarMesAnterior() {
    const hoy = new Date();
    const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);

    this.fechaInicioActual = new Date(mesAnterior.getFullYear(), mesAnterior.getMonth(), 1, 0, 0, 0, 0);
    this.fechaFinActual = new Date(mesAnterior.getFullYear(), mesAnterior.getMonth() + 1, 0, 23, 59, 59, 999);

    const nombreMes = mesAnterior.toLocaleString('es-BO', { month: 'short' }).toUpperCase();
    this.tituloFecha = `${nombreMes} ${mesAnterior.getFullYear()}`;
    this.tituloResumen = `Ventas de ${nombreMes}`;
    this.mostrandoHoy = false;

    this.cargarVentas();
  }

  aplicarFiltroPersonalizado() {
    const fechaInicio = new Date(this.fechaInicioPersonalizada);
    const fechaFin = new Date(this.fechaFinPersonalizada);

    if (fechaInicio > fechaFin) {
      this.mostrarAlerta('Error', 'La fecha de inicio debe ser anterior o igual a la fecha de fin');
      return;
    }

    this.fechaInicioActual = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate(), 0, 0, 0, 0);
    this.fechaFinActual = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate(), 23, 59, 59, 999);

    const formatoCorto: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };
    const inicioStr = fechaInicio.toLocaleDateString('es-BO', formatoCorto);
    const finStr = fechaFin.toLocaleDateString('es-BO', formatoCorto);

    this.tituloFecha = `${inicioStr} - ${finStr}`;
    this.tituloResumen = 'Ventas del Período';
    this.mostrandoHoy = false;

    this.cargarVentas();
  }

  abrirFiltroFechas() {
    this.modalFiltroFechas.present();
  }

  async cargarVentas() {
    this.loading = true;
    try {
      const inicioAmplio = new Date(this.fechaInicioActual);
      inicioAmplio.setDate(inicioAmplio.getDate() - 1);
      inicioAmplio.setHours(0, 0, 0, 0);

      const finAmplio = new Date(this.fechaFinActual);
      finAmplio.setDate(finAmplio.getDate() + 1);
      finAmplio.setHours(23, 59, 59, 999);

      const todasLasVentas = await this.supabaseService.getVentasPorFecha(
        inicioAmplio.toISOString(),
        finAmplio.toISOString()
      );

      const ventasFiltradas = todasLasVentas.filter(venta => {
        const fechaVenta = new Date(venta.fecha);
        const diaVenta = fechaVenta.getDate();
        const mesVenta = fechaVenta.getMonth();
        const añoVenta = fechaVenta.getFullYear();

        const diaInicio = this.fechaInicioActual.getDate();
        const mesInicio = this.fechaInicioActual.getMonth();
        const añoInicio = this.fechaInicioActual.getFullYear();

        const diaFin = this.fechaFinActual.getDate();
        const mesFin = this.fechaFinActual.getMonth();
        const añoFin = this.fechaFinActual.getFullYear();

        const fechaVentaSinHora = new Date(añoVenta, mesVenta, diaVenta);
        const fechaInicioSinHora = new Date(añoInicio, mesInicio, diaInicio);
        const fechaFinSinHora = new Date(añoFin, mesFin, diaFin);

        return fechaVentaSinHora >= fechaInicioSinHora && fechaVentaSinHora <= fechaFinSinHora;
      });

      console.log('Ventas cargadas:', ventasFiltradas.length);

      this.procesarResumenVentas(ventasFiltradas);
      this.procesarVentasRecientes(ventasFiltradas);

    } catch (error) {
      console.error('Error cargando ventas:', error);
      this.mostrarAlerta('Error', 'No se pudieron cargar las ventas');
    } finally {
      this.loading = false;
    }
  }

  procesarResumenVentas(ventas: any[]) {
    this.salesData = {
      efectivo: 0,
      transferencia: 0,
      tarjeta: 0,
      total: 0
    };

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
    const nombreProductos = productos.length > 0
      ? productos.map((p: any) => p.productos?.nombre).filter(Boolean).slice(0, 2).join(', ')
      : 'Sin productos';

    //DEBUG: Ver empleado_id de cada venta
    console.log(`🔍 Venta ${venta.id} - empleado_id:`, venta.empleado_id);

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
        empleado_id: venta.empleado_id,  //Esto debe tener el ID correcto
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

  registerSale() {
    this.router.navigate(['/nueva-venta']);
  }

  verDetalleVenta(venta: any) {
    this.router.navigate(['/detalle-venta'], {
      queryParams: {
        ventaData: JSON.stringify(venta.ventaCompleta)
      }
    });
  }

  async mostrarOpcionesUsuario(_event: any) {
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
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async ionViewWillEnter() {
    console.log('🔄 ionViewWillEnter ejecutado en tab1');
    if (this.mostrandoHoy) {
      await this.cargarVentas();
    }
  }
}
