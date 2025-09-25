import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.page.html',
  styleUrls: ['./crear-producto.page.scss'],
  standalone: false
})
export class CrearProductoPage implements OnInit {

  esEdicion: boolean = false;
  productoId: string = '';

  producto = {
    nombre: '',
    cantidad: 0,
    precioUnitario: 0,
    costoUnitario: 0,
    categoria: '',
    imagen: null
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // Verificar si es edición
    this.route.paramMap.subscribe(params => {
      this.productoId = params.get('id') || '';
      this.esEdicion = !!this.productoId;
      
      if (this.esEdicion) {
        this.cargarProducto();
      }
    });
  }

  cargarProducto() {
    // Aquí cargarías el producto desde la base de datos
    // Por ahora simulamos datos
    this.producto = {
      nombre: 'Producto Ejemplo',
      cantidad: 10,
      precioUnitario: 50.00,
      costoUnitario: 30.00,
      categoria: 'categoria1',
      imagen: null
    };
  }

  seleccionarImagen() {
    // Aquí implementarías la selección de imagen
    console.log('Seleccionar imagen del producto');
    // Podrías usar Capacitor Camera o un file input
  }

  volver() {
    this.location.back();
  }

  guardarProducto() {
    // Validar que los campos requeridos estén llenos
    if (!this.producto.nombre.trim()) {
      console.log('El nombre del producto es requerido');
      return;
    }

    if (this.producto.cantidad <= 0) {
      console.log('La cantidad debe ser mayor a 0');
      return;
    }

    if (this.producto.precioUnitario <= 0) {
      console.log('El precio unitario debe ser mayor a 0');
      return;
    }

    if (!this.producto.categoria) {
      console.log('Debe seleccionar una categoría');
      return;
    }

    // Aquí enviarías los datos a la base de datos
    console.log('Guardando producto:', this.producto);

    if (this.esEdicion) {
      console.log('Actualizando producto existente');
      // Actualizar producto existente
    } else {
      console.log('Creando nuevo producto');
      // Crear nuevo producto
    }

    // Volver a la página de productos
    this.router.navigate(['/tabs/tab2']);
  }
}