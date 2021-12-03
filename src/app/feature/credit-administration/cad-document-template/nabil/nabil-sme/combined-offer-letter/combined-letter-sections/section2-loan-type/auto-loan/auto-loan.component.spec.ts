import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoLoanComponent } from './auto-loan.component';

describe('AutoLoanComponent', () => {
  let component: AutoLoanComponent;
  let fixture: ComponentFixture<AutoLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
