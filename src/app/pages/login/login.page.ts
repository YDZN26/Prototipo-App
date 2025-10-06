import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  username: string = '';
  password: string = '';
  loading: boolean = false;
  mostrarContrasena: boolean = false;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) { }

  ngOnInit() {
    // Verificar si ya hay una sesión activa
    this.checkSession();
  }

  async checkSession() {
  try {
    const session = await this.supabaseService.getSession();
    if (session) {
      // Ya hay sesión activa, redirigir al dashboard
      this.router.navigate(['/tabs/tab1']);
    }
  } catch (error) {
    console.log('No hay sesión activa:', error);
  }
}

  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  async login() {
      if (!this.username.trim() || !this.password.trim()) {
        alert('Por favor ingresa usuario y contraseña');
        return;
      }

      this.loading = true;

      try {
        // ✅ NUEVO: Limpiar localStorage antes de login
        localStorage.removeItem('empleado');
        localStorage.removeItem('nombreUsuario');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('authUserId');

        // Login con Supabase Auth (contraseñas hasheadas)
        const result = await this.supabaseService.login(this.username, this.password);

        if (result && result.empleado) {
          // Guardar datos del empleado en localStorage
          localStorage.setItem('empleado', JSON.stringify(result.empleado));
          localStorage.setItem('nombreUsuario', result.empleado.nombre);
          localStorage.setItem('userId', result.empleado.id.toString());
          localStorage.setItem('userRole', result.empleado.rol);
          localStorage.setItem('authUserId', result.user.id);

          console.log('Login exitoso:', result.empleado);

          // ✅ NUEVO: Forzar recarga completa de la página
          window.location.href = '/tabs/tab1';
        }
      } catch (error: any) {
        console.error('Error al iniciar sesión:', error);

        if (error.message.includes('Invalid login credentials')) {
          alert('Usuario o contraseña incorrectos');
        } else if (error.message.includes('Email not confirmed')) {
          alert('Debes confirmar tu correo electrónico antes de iniciar sesión');
        } else {
          alert('Usuario o contraseña incorrectos');
        }
      } finally {
        this.loading = false;
      }
    }
}
