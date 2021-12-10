import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityRevaluationComponent } from './security-revaluation.component';

describe('SecurityRevaluationComponent', () => {
  let component: SecurityRevaluationComponent;
  let fixture: ComponentFixture<SecurityRevaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityRevaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityRevaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
