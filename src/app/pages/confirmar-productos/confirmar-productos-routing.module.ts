import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmarProductosPage } from './confirmar-productos.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmarProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmarProductosPageRoutingModule {}
