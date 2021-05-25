import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgRetailLoanComponent } from './pg-retail-loan.component';

describe('PgRetailLoanComponent', () => {
  let component: PgRetailLoanComponent;
  let fixture: ComponentFixture<PgRetailLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgRetailLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgRetailLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
