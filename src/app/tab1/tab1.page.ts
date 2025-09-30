import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, AlertController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase';

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
  ) {}

  ngOnInit() {
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    if (nombreGuardado) {
      this.nombreUsuario = nombreGuardado;
    }
    this.filtrarHoy();
  }

  // Agregar esta función helper para formatear fecha corta
private formatearFechaCorta(fecha: Date): string {
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  return `${dia}/${mes}`;
}

// ACTUALIZAR filtrarHoy()
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

// ACTUALIZAR filtrarAyer()
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

// ACTUALIZAR filtrarEstaSemana()
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

// ACTUALIZAR filtrarEsteMes()
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

// ACTUALIZAR filtrarMesAnterior()
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
      const inicioAjustado = new Date(this.fechaInicioActual.getTime() - (4 * 60 * 60 * 1000));
      const finAjustado = new Date(this.fechaFinActual.getTime() - (4 * 60 * 60 * 1000));

      const ventas = await this.supabaseService.getVentasPorFecha(
        inicioAjustado.toISOString(),
        finAjustado.toISOString()
      );

      this.procesarResumenVentas(ventas);
      this.procesarVentasRecientes(ventas);

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
      const fechaBD = new Date(venta.fecha);
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
    if (this.mostrandoHoy) {
      await this.cargarVentas();
    }
  }
}
