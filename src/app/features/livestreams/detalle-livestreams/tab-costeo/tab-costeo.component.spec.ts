import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabCosteoComponent } from './tab-costeo.component';

describe('TabCosteoComponent', () => {
  let component: TabCosteoComponent;
  let fixture: ComponentFixture<TabCosteoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabCosteoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabCosteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
