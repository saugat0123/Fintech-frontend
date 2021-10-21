import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoLoanCommercialComponent } from './auto-loan-commercial.component';

describe('AutoLoanCommercialComponent', () => {
  let component: AutoLoanCommercialComponent;
  let fixture: ComponentFixture<AutoLoanCommercialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoLoanCommercialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoLoanCommercialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
