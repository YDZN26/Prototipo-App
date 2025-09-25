import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearProveedorPage } from './crear-proveedor.page';

const routes: Routes = [
  {
    path: '',
    component: CrearProveedorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearProveedorPageRoutingModule {}
