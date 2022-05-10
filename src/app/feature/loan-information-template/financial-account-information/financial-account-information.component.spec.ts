import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountInformationComponent } from './financial-account-information.component';

describe('FinancialAccountInformationComponent', () => {
  let component: FinancialAccountInformationComponent;
  let fixture: ComponentFixture<FinancialAccountInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialAccountInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialAccountInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
