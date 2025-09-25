import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeleccionarProductosPage } from './seleccionar-productos.page';

describe('SeleccionarProductosPage', () => {
  let component: SeleccionarProductosPage;
  let fixture: ComponentFixture<SeleccionarProductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
