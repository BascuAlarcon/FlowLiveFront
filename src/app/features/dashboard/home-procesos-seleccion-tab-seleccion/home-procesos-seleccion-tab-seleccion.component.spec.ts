import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProcesosSeleccionTabSeleccionComponent } from './home-procesos-seleccion-tab-seleccion.component';

describe('HomeProcesosSeleccionTabSeleccionComponent', () => {
  let component: HomeProcesosSeleccionTabSeleccionComponent;
  let fixture: ComponentFixture<HomeProcesosSeleccionTabSeleccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProcesosSeleccionTabSeleccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProcesosSeleccionTabSeleccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
