import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section2LoanTypeRetailComponent } from './section2-loan-type-retail.component';

describe('Section2LoanTypeRetailComponent', () => {
  let component: Section2LoanTypeRetailComponent;
  let fixture: ComponentFixture<Section2LoanTypeRetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section2LoanTypeRetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section2LoanTypeRetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
