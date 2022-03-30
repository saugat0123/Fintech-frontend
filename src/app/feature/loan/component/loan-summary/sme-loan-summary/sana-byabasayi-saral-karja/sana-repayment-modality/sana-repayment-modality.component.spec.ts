import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanaRepaymentModalityComponent } from './sana-repayment-modality.component';

describe('SanaRepaymentModalityComponent', () => {
  let component: SanaRepaymentModalityComponent;
  let fixture: ComponentFixture<SanaRepaymentModalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanaRepaymentModalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanaRepaymentModalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
