import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditChecklistGeneralComponent } from './credit-checklist-general.component';

describe('CreditChecklistGeneralComponent', () => {
  let component: CreditChecklistGeneralComponent;
  let fixture: ComponentFixture<CreditChecklistGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditChecklistGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditChecklistGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
