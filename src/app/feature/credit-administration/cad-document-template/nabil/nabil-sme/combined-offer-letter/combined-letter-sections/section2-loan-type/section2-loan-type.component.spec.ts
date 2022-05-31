import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section2LoanTypeComponent } from './section2-loan-type.component';

describe('Section2LoanTypeComponent', () => {
  let component: Section2LoanTypeComponent;
  let fixture: ComponentFixture<Section2LoanTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section2LoanTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section2LoanTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
