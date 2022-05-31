import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section1IntroductionComponent } from './section1-introduction.component';

describe('Section1IntroductionComponent', () => {
  let component: Section1IntroductionComponent;
  let fixture: ComponentFixture<Section1IntroductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section1IntroductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section1IntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
