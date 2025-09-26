import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'crear-producto',
    loadChildren: () => import('./pages/crear-producto/crear-producto.module').then(m => m.CrearProductoPageModule)
  },
  {
    path: 'editar-producto/:id',
    loadChildren: () => import('./pages/crear-producto/crear-producto.module').then(m => m.CrearProductoPageModule)
  },
  {
    path: 'crear-cliente',
    loadChildren: () => import('./pages/crear-cliente/crear-cliente.module').then( m => m.CrearClientePageModule)
  },
  {
    path: 'crear-cliente',
    loadChildren: () => import('./pages/crear-cliente/crear-cliente.module').then(m => m.CrearClientePageModule)
  },
  {
    path: 'editar-cliente/:id',
    loadChildren: () => import('./pages/crear-cliente/crear-cliente.module').then(m => m.CrearClientePageModule)
  },
  {
    path: 'crear-empleado',
    loadChildren: () => import('./pages/crear-empleado/crear-empleado.module').then( m => m.CrearEmpleadoPageModule)
  },
  {
    path: 'crear-empleado',
    loadChildren: () => import('./pages/crear-empleado/crear-empleado.module').then(m => m.CrearEmpleadoPageModule)
  },
  {
    path: 'editar-empleado/:id',
    loadChildren: () => import('./pages/crear-empleado/crear-empleado.module').then(m => m.CrearEmpleadoPageModule)
  },
  {
    path: 'crear-proveedor',
    loadChildren: () => import('./pages/crear-proveedor/crear-proveedor.module').then( m => m.CrearProveedorPageModule)
  },
  {
    path: 'crear-proveedor',
    loadChildren: () => import('./pages/crear-proveedor/crear-proveedor.module').then(m => m.CrearProveedorPageModule)
  },
  {
    path: 'editar-proveedor/:id',
    loadChildren: () => import('./pages/crear-proveedor/crear-proveedor.module').then(m => m.CrearProveedorPageModule)
  },
  {
    path: 'nueva-venta',
    loadChildren: () => import('./pages/nueva-venta/nueva-venta.module').then( m => m.NuevaVentaPageModule)
  },
  {
    path: 'nueva-venta',
    loadChildren: () => import('./pages/nueva-venta/nueva-venta.module').then(m => m.NuevaVentaPageModule)
  },
  {
    path: 'seleccionar-productos',
    loadChildren: () => import('./pages/seleccionar-productos/seleccionar-productos.module').then( m => m.SeleccionarProductosPageModule)
  },
  {
    path: 'seleccionar-productos',
    loadChildren: () => import('./pages/seleccionar-productos/seleccionar-productos.module').then(m => m.SeleccionarProductosPageModule)
  },
  {
    path: 'confirmar-productos',
    loadChildren: () => import('./pages/confirmar-productos/confirmar-productos.module').then( m => m.ConfirmarProductosPageModule)
  },
  {
    path: 'detalle-venta',
    loadChildren: () => import('./pages/detalle-venta/detalle-venta.module').then(m => m.DetalleVentaPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
