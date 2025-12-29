import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarLivestreamsComponent } from './listar-livestreams.component';

describe('ListarLivestreamsComponent', () => {
  let component: ListarLivestreamsComponent;
  let fixture: ComponentFixture<ListarLivestreamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarLivestreamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarLivestreamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
