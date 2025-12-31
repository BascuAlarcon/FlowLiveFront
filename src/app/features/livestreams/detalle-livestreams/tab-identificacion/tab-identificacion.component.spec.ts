import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabIdentificacionComponent } from './tab-identificacion.component';

describe('TabIdentificacionComponent', () => {
  let component: TabIdentificacionComponent;
  let fixture: ComponentFixture<TabIdentificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabIdentificacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabIdentificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
