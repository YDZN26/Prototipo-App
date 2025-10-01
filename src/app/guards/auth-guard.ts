import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Verificar si hay un usuario logueado en localStorage
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const userId = localStorage.getItem('userId');

    if (nombreUsuario && userId) {
      // Usuario autenticado, permitir acceso
      return true;
    } else {
      // No hay sesión, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }
  }
}