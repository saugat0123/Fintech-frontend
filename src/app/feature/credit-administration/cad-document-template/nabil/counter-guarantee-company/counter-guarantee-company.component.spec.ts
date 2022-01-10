import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterGuaranteeCompanyComponent } from './counter-guarantee-company.component';

describe('CounterGuaranteeCompanyComponent', () => {
  let component: CounterGuaranteeCompanyComponent;
  let fixture: ComponentFixture<CounterGuaranteeCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterGuaranteeCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterGuaranteeCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
