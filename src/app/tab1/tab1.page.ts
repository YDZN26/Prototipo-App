import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';

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

  salesData = {
    efectivo: 0,
    transferencia: 0,
    tarjeta: 0,
    total: 0
  };

  recentProducts = [
    {
      name: 'NombreProductos',
      type: 'TipoDePago',
      time: '00/00/0000 - 00:00 am',
      price: 0
    },
    {
      name: 'NombreProductos',
      type: 'TipoDePago', 
      time: '00/00/0000 - 00:00 am',
      price: 0
    },
    {
      name: 'NombreProductos',
      type: 'TipoDePago',
      time: '00/00/0000 - 00:00 am', 
      price: 0
    },
    {
      name: 'NombreProductos',
      type: 'TipoDePago',
      time: '00/00/0000 - 00:00 am',
      price: 0
    }
  ];

  filteredProducts = this.recentProducts;

  constructor(private router: Router) {}

  ngOnInit() {
    // Generar días históricos
    this.generarDiasHistoricos(30);
    
    // Seleccionar día actual
    const fecha = new Date();
    const day = fecha.getDate();
    const mes = fecha.toLocaleString('es-BO', { month: 'long' });
    this.selectedDay = `${day} de ${mes}`;
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

  onDaySelected(dayString: string | null) {
    if (!dayString) return;
    this.selectedDay = dayString;
    // Aquí cargarías los datos para la fecha seleccionada
    console.log('Fecha seleccionada:', dayString);
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
    // Aquí cargarías los datos para la fecha seleccionada
  }

  registerSale() {
    // Navegación a página de nueva venta
    console.log('Registrar venta');
  }
}