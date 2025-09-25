import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmarProductosPage } from './confirmar-productos.page';

describe('ConfirmarProductosPage', () => {
  let component: ConfirmarProductosPage;
  let fixture: ComponentFixture<ConfirmarProductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
