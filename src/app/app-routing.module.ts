import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { RoleGuard } from './guards/role-guard';

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
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  // ✅ PRODUCTOS - Solo administrador
  {
    path: 'crear-producto',
    loadChildren: () => import('./pages/crear-producto/crear-producto.module').then(m => m.CrearProductoPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'editar-producto/:id',
    loadChildren: () => import('./pages/crear-producto/crear-producto.module').then(m => m.CrearProductoPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },
  // ✅ CLIENTES - Administrador y Vendedor
  {
    path: 'crear-cliente',
    loadChildren: () => import('./pages/crear-cliente/crear-cliente.module').then(m => m.CrearClientePageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador', 'vendedor'] }
  },
  {
    path: 'editar-cliente/:id',
    loadChildren: () => import('./pages/crear-cliente/crear-cliente.module').then(m => m.CrearClientePageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador', 'vendedor'] }
  },
  // ✅ EMPLEADOS - Solo administrador
  {
    path: 'crear-empleado',
    loadChildren: () => import('./pages/crear-empleado/crear-empleado.module').then(m => m.CrearEmpleadoPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'editar-empleado/:id',
    loadChildren: () => import('./pages/crear-empleado/crear-empleado.module').then(m => m.CrearEmpleadoPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },
  // ✅ PROVEEDORES - Solo administrador
  {
    path: 'crear-proveedor',
    loadChildren: () => import('./pages/crear-proveedor/crear-proveedor.module').then(m => m.CrearProveedorPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'editar-proveedor/:id',
    loadChildren: () => import('./pages/crear-proveedor/crear-proveedor.module').then(m => m.CrearProveedorPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador'] }
  },
  // ✅ VENTAS - Administrador y Vendedor
  {
    path: 'nueva-venta',
    loadChildren: () => import('./pages/nueva-venta/nueva-venta.module').then(m => m.NuevaVentaPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador', 'vendedor'] }
  },
  {
    path: 'seleccionar-productos',
    loadChildren: () => import('./pages/seleccionar-productos/seleccionar-productos.module').then(m => m.SeleccionarProductosPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador', 'vendedor'] }
  },
  {
    path: 'confirmar-productos',
    loadChildren: () => import('./pages/confirmar-productos/confirmar-productos.module').then(m => m.ConfirmarProductosPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador', 'vendedor'] }
  },
  {
    path: 'detalle-venta',
    loadChildren: () => import('./pages/detalle-venta/detalle-venta.module').then(m => m.DetalleVentaPageModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrador', 'vendedor'] }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}