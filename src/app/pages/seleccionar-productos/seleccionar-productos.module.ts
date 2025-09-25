import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeleccionarProductosPageRoutingModule } from './seleccionar-productos-routing.module';

import { SeleccionarProductosPage } from './seleccionar-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeleccionarProductosPageRoutingModule
  ],
  declarations: [SeleccionarProductosPage]
})
export class SeleccionarProductosPageModule {}
