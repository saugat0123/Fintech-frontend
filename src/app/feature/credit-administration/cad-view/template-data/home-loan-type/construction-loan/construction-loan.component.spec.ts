import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionLoanComponent } from './construction-loan.component';

describe('ConstructionLoanComponent', () => {
  let component: ConstructionLoanComponent;
  let fixture: ComponentFixture<ConstructionLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructionLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
