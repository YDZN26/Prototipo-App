import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase'; // Sin .service

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

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) { }

  ngOnInit() {
  }

  async login() {
    if (!this.username.trim() || !this.password.trim()) {
      console.log('Por favor ingresa usuario y contraseña');
      return;
    }

    this.loading = true;

    try {
      const empleado = await this.supabaseService.login(this.username, this.password);
      
      if (empleado) {
        // Guardar datos del empleado en localStorage
        localStorage.setItem('empleado', JSON.stringify(empleado));
        localStorage.setItem('nombreUsuario', empleado.nombre);
        
        // Navegar al dashboard
        this.router.navigate(['/tabs/tab1']);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Usuario o contraseña incorrectos');
    } finally {
      this.loading = false;
    }
  }
}