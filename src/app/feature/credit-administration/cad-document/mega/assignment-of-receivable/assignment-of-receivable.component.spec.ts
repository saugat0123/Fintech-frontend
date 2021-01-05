import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentOfReceivableComponent } from './assignment-of-receivable.component';

describe('AssignmentOfReceivableComponent', () => {
  let component: AssignmentOfReceivableComponent;
  let fixture: ComponentFixture<AssignmentOfReceivableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentOfReceivableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentOfReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
