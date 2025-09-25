import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeleccionarProductosPage } from './seleccionar-productos.page';

const routes: Routes = [
  {
    path: '',
    component: SeleccionarProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeleccionarProductosPageRoutingModule {}
