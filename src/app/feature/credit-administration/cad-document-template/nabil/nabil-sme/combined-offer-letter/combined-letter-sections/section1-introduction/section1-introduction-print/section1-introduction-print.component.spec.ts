import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section1IntroductionPrintComponent } from './section1-introduction-print.component';

describe('Section1IntroductionPrintComponent', () => {
  let component: Section1IntroductionPrintComponent;
  let fixture: ComponentFixture<Section1IntroductionPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section1IntroductionPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section1IntroductionPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
