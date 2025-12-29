import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleLivestreamsComponent } from './detalle-livestreams.component';

describe('DetalleLivestreamsComponent', () => {
  let component: DetalleLivestreamsComponent;
  let fixture: ComponentFixture<DetalleLivestreamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleLivestreamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleLivestreamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
