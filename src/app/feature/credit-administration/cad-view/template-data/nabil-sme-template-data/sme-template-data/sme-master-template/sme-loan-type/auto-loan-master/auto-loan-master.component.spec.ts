import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoLoanMasterComponent } from './auto-loan-master.component';

describe('AutoLoanMasterComponent', () => {
  let component: AutoLoanMasterComponent;
  let fixture: ComponentFixture<AutoLoanMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoLoanMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoLoanMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
