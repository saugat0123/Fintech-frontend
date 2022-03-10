import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveInspectionComponent } from './above-inspection.component';

describe('AboveInspectionComponent', () => {
  let component: AboveInspectionComponent;
  let fixture: ComponentFixture<AboveInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
