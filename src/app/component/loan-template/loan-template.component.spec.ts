import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanTemplateComponent } from './loan-template.component';

describe('LoanTemplateComponent', () => {
  let component: LoanTemplateComponent;
  let fixture: ComponentFixture<LoanTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
