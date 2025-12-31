import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabGestionComponent } from './tab-gestion.component';

describe('TabGestionComponent', () => {
  let component: TabGestionComponent;
  let fixture: ComponentFixture<TabGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabGestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
