import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section2LoanTypePrintComponent } from './section2-loan-type-print.component';

describe('Section2LoanTypePrintComponent', () => {
  let component: Section2LoanTypePrintComponent;
  let fixture: ComponentFixture<Section2LoanTypePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section2LoanTypePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section2LoanTypePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
