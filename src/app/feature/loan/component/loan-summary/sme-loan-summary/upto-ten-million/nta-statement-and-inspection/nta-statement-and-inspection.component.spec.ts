import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NtaStatementAndInspectionComponent } from './nta-statement-and-inspection.component';

describe('NtaStatementAndInspectionComponent', () => {
  let component: NtaStatementAndInspectionComponent;
  let fixture: ComponentFixture<NtaStatementAndInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NtaStatementAndInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NtaStatementAndInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
