import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UptoDisbursementModalityComponent } from './upto-disbursement-modality.component';

describe('UptoDisbursementModalityComponent', () => {
  let component: UptoDisbursementModalityComponent;
  let fixture: ComponentFixture<UptoDisbursementModalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UptoDisbursementModalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UptoDisbursementModalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
