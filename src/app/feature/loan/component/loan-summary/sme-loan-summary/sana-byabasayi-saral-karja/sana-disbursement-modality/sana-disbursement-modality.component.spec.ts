import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanaDisbursementModalityComponent } from './sana-disbursement-modality.component';

describe('SanaDisbursementModalityComponent', () => {
  let component: SanaDisbursementModalityComponent;
  let fixture: ComponentFixture<SanaDisbursementModalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanaDisbursementModalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanaDisbursementModalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
