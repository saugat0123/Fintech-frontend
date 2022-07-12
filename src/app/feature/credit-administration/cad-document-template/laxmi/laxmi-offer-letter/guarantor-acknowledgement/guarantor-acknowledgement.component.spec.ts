import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuarantorAcknowledgementComponent } from './guarantor-acknowledgement.component';

describe('GuarantorAcknowledgementComponent', () => {
  let component: GuarantorAcknowledgementComponent;
  let fixture: ComponentFixture<GuarantorAcknowledgementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuarantorAcknowledgementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuarantorAcknowledgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
