import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProcesosSeleccionTabGeneralesComponent } from './home-procesos-seleccion-tab-generales.component';

describe('HomeProcesosSeleccionTabGeneralesComponent', () => {
  let component: HomeProcesosSeleccionTabGeneralesComponent;
  let fixture: ComponentFixture<HomeProcesosSeleccionTabGeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProcesosSeleccionTabGeneralesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProcesosSeleccionTabGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
