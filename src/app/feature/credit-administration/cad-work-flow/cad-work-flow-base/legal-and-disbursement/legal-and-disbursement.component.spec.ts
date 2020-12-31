import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalAndDisbursementComponent } from './legal-and-disbursement.component';

describe('LegalAndDisbursementComponent', () => {
  let component: LegalAndDisbursementComponent;
  let fixture: ComponentFixture<LegalAndDisbursementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalAndDisbursementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalAndDisbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
