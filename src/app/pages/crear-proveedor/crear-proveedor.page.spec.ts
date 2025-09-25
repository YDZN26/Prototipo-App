import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearProveedorPage } from './crear-proveedor.page';

describe('CrearProveedorPage', () => {
  let component: CrearProveedorPage;
  let fixture: ComponentFixture<CrearProveedorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearProveedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
