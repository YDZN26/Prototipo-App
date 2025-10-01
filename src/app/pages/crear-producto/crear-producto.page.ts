import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { IonModal, AlertController } from '@ionic/angular';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.page.html',
  styleUrls: ['./crear-producto.page.scss'],
  standalone: false
})
export class CrearProductoPage implements OnInit {

  @ViewChild('modalOpcionesImagen', { static: false }) modalOpcionesImagen!: IonModal;
  @ViewChild('modalURL', { static: false }) modalURL!: IonModal;
  @ViewChild('modalCategorias', { static: false }) modalCategorias!: IonModal;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  esEdicion: boolean = false;
  productoId: string = '';
  categorias: any[] = [];
  loading = false;

  modalImagenAbierto: boolean = false;
  modalURLAbierto: boolean = false;
  modalCategoriasAbierto: boolean = false;
  urlTemporal: string = '';
  imagenCargada: boolean = false;
  imagenError: boolean = false;
  categoriaSeleccionadaNombre: string = '';

  producto = {
    nombre: '',
    cantidad: 0,
    precioUnitario: 0,
    costoUnitario: 0,
    categoria: '',
    imagenUrl: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private supabaseService: SupabaseService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.cargarCategorias();

    this.route.paramMap.subscribe(params => {
      this.productoId = params.get('id') || '';
      this.esEdicion = !!this.productoId;

      if (this.esEdicion) {
        this.cargarProducto();
      }
    });
  }

  async cargarCategorias() {
    try {
      this.categorias = await this.supabaseService.getCategorias();
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  }

  async cargarProducto() {
    try {
      const productos = await this.supabaseService.getProductos();
      const productoData = productos.find(p => p.id == this.productoId);

      if (productoData) {
        this.producto = {
          nombre: productoData.nombre,
          cantidad: productoData.stock,
          precioUnitario: productoData.precio,
          costoUnitario: productoData.costo || 0,
          categoria: productoData.categoria_id,
          imagenUrl: productoData.imagen_url || ''
        };

        const categoriaSeleccionada = this.categorias.find(c => c.id === productoData.categoria_id);
        if (categoriaSeleccionada) {
          this.categoriaSeleccionadaNombre = categoriaSeleccionada.nombre;
        }
      }
    } catch (error) {
      console.error('Error cargando producto:', error);
    }
  }

  volver() {
    this.location.back();
  }

  // ✅ NUEVO: Validar que solo se ingresen números positivos (>= 0)
  validarNumeroPositivo(event: any, campo: string) {
    const input = event.target;
    let valor = parseFloat(input.value);

    // Si el valor es negativo o NaN, establecer en 0
    if (isNaN(valor) || valor < 0) {
      valor = 0;
    }

    // Actualizar el valor en el modelo según el campo
    switch(campo) {
      case 'cantidad':
        this.producto.cantidad = Math.floor(valor); // Cantidad debe ser entero
        input.value = this.producto.cantidad;
        break;
      case 'precioUnitario':
        this.producto.precioUnitario = Math.round(valor * 100) / 100; // Máximo 2 decimales
        input.value = this.producto.precioUnitario;
        break;
      case 'costoUnitario':
        this.producto.costoUnitario = Math.round(valor * 100) / 100; // Máximo 2 decimales
        input.value = this.producto.costoUnitario;
        break;
    }
  }

  // Gestión de modales de imagen
  mostrarOpcionesImagen() {
    this.modalImagenAbierto = true;
  }

  cerrarModalImagen() {
    this.modalImagenAbierto = false;
  }

  mostrarFormularioURL() {
    this.modalImagenAbierto = false;
    this.modalURLAbierto = true;
    this.urlTemporal = '';
    this.imagenCargada = false;
    this.imagenError = false;
  }

  cerrarModalURL() {
    this.modalURLAbierto = false;
    this.modalImagenAbierto = true;
  }

  // Opción 1: Subir desde dispositivo
  abrirGaleria() {
    this.cerrarModalImagen();
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.mostrarAlerta('Error', 'Por favor selecciona un archivo de imagen válido');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.producto.imagenUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Opción 2: Pegar URL
  guardarURL() {
    if (this.urlTemporal && !this.imagenError) {
      this.producto.imagenUrl = this.urlTemporal;
      this.cerrarModalURL();
      this.modalImagenAbierto = false;
    }
  }

  onImageLoad() {
    this.imagenCargada = true;
    this.imagenError = false;
  }

  onImageError() {
    this.imagenCargada = false;
    this.imagenError = true;
  }

  eliminarImagen() {
    this.producto.imagenUrl = '';
  }

  // Gestión de modal de categorías
  abrirModalCategorias() {
    this.modalCategoriasAbierto = true;
  }

  cerrarModalCategorias() {
    this.modalCategoriasAbierto = false;
  }

  seleccionarCategoria(categoria: any) {
    this.producto.categoria = categoria.id;
    this.categoriaSeleccionadaNombre = categoria.nombre;
    this.cerrarModalCategorias();
  }

  // Guardar producto
  async guardarProducto() {
    if (!this.validarProducto()) return;

    this.loading = true;

    try {
      const productoData = {
        nombre: this.producto.nombre,
        cantidad: this.producto.cantidad,
        precioUnitario: this.producto.precioUnitario,
        costoUnitario: this.producto.costoUnitario,
        categoria: this.producto.categoria,
        imagenUrl: this.producto.imagenUrl
      };

      if (this.esEdicion) {
        await this.supabaseService.updateProducto(parseInt(this.productoId), productoData);
      } else {
        await this.supabaseService.createProducto(productoData);
      }

      this.router.navigate(['/tabs/tab2']);
    } catch (error) {
      console.error('Error guardando producto:', error);
      this.mostrarAlerta('Error', 'No se pudo guardar el producto');
    } finally {
      this.loading = false;
    }
  }

  validarProducto(): boolean {
    if (!this.producto.nombre.trim()) {
      this.mostrarAlerta('Error', 'El nombre del producto es requerido');
      return false;
    }

    if (this.producto.cantidad < 0) {
      this.mostrarAlerta('Error', 'La cantidad no puede ser negativa');
      return false;
    }

    if (this.producto.precioUnitario < 0) {
      this.mostrarAlerta('Error', 'El precio unitario no puede ser negativo');
      return false;
    }

    if (this.producto.costoUnitario < 0) {
      this.mostrarAlerta('Error', 'El costo unitario no puede ser negativo');
      return false;
    }

    if (!this.producto.categoria) {
      this.mostrarAlerta('Error', 'Debe seleccionar una categoría');
      return false;
    }

    return true;
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}