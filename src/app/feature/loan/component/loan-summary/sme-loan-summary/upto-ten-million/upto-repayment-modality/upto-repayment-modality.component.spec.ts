import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UptoRepaymentModalityComponent } from './upto-repayment-modality.component';

describe('UptoRepaymentModalityComponent', () => {
  let component: UptoRepaymentModalityComponent;
  let fixture: ComponentFixture<UptoRepaymentModalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UptoRepaymentModalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UptoRepaymentModalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
