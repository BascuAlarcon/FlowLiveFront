import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProcesosSeleccionTabIngresoComponent } from './home-procesos-seleccion-tab-ingreso.component';

describe('HomeProcesosSeleccionTabIngresoComponent', () => {
  let component: HomeProcesosSeleccionTabIngresoComponent;
  let fixture: ComponentFixture<HomeProcesosSeleccionTabIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProcesosSeleccionTabIngresoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProcesosSeleccionTabIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
