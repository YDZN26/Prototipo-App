import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmarProductosPageRoutingModule } from './confirmar-productos-routing.module';

import { ConfirmarProductosPage } from './confirmar-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmarProductosPageRoutingModule
  ],
  declarations: [ConfirmarProductosPage]
})
export class ConfirmarProductosPageModule {}
