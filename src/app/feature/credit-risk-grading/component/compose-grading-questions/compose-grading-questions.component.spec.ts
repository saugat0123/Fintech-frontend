import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposeGradingQuestionsComponent } from './compose-grading-questions.component';

describe('ComposeGradingQuestionsComponent', () => {
  let component: ComposeGradingQuestionsComponent;
  let fixture: ComponentFixture<ComposeGradingQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComposeGradingQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposeGradingQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
