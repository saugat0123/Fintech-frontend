import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterGuaranteeProprietorshipComponent } from './counter-guarantee-proprietorship.component';

describe('CounterGuaranteeProprietorshipComponent', () => {
  let component: CounterGuaranteeProprietorshipComponent;
  let fixture: ComponentFixture<CounterGuaranteeProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterGuaranteeProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterGuaranteeProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
