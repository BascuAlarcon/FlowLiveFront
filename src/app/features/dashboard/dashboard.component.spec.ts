import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProcesosSeleccionComponent } from './dashboard.component';

describe('HomeProcesosSeleccionComponent', () => {
  let component: HomeProcesosSeleccionComponent;
  let fixture: ComponentFixture<HomeProcesosSeleccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProcesosSeleccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProcesosSeleccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
