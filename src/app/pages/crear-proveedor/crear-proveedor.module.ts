import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearProveedorPageRoutingModule } from './crear-proveedor-routing.module';

import { CrearProveedorPage } from './crear-proveedor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearProveedorPageRoutingModule
  ],
  declarations: [CrearProveedorPage]
})
export class CrearProveedorPageModule {}
