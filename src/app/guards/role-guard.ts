import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userRole = localStorage.getItem('userRole');
    const allowedRoles = route.data['roles'] as Array<string>;

    if (!userRole) {
      // No hay rol, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }

    if (allowedRoles && allowedRoles.includes(userRole)) {
      // El rol del usuario está permitido
      return true;
    } else {
      // Rol no autorizado, redirigir al dashboard
      alert('No tienes permisos para acceder a esta sección');
      this.router.navigate(['/tabs/tab1']);
      return false;
    }
  }
}