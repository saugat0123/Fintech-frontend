import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterGuaranteePartnershipComponent } from './counter-guarantee-partnership.component';

describe('CounterGuaranteePartnershipComponent', () => {
  let component: CounterGuaranteePartnershipComponent;
  let fixture: ComponentFixture<CounterGuaranteePartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterGuaranteePartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterGuaranteePartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
