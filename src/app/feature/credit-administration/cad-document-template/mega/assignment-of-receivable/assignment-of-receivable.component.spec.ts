import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssignmentOfReceivableComponent } from './assignment-of-receivable.component';

describe('AssignmentOfReceivableComponent', () => {
  let component: AssignmentOfReceivableComponent;
  let fixture: ComponentFixture<AssignmentOfReceivableComponent>;

  beforeEach(waitForAsync(() => {
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
