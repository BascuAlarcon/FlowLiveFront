import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicesProyectoComponent } from './indices-proyecto.component';

describe('IndicesProyectoComponent', () => {
  let component: IndicesProyectoComponent;
  let fixture: ComponentFixture<IndicesProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicesProyectoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicesProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
