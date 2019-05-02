import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeQuestionComponent } from './scheme-question.component';

describe('SchemeQuestionComponent', () => {
  let component: SchemeQuestionComponent;
  let fixture: ComponentFixture<SchemeQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemeQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
