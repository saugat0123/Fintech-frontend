import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionLoanEditComponent } from './construction-loan-edit.component';

describe('ConstructionLoanEditComponent', () => {
  let component: ConstructionLoanEditComponent;
  let fixture: ComponentFixture<ConstructionLoanEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructionLoanEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionLoanEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
