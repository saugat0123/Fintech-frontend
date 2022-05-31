import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLoanCombinedTemplateDataComponent } from './home-loan-combined-template-data.component';

describe('HomeLoanCombinedTemplateDataComponent', () => {
  let component: HomeLoanCombinedTemplateDataComponent;
  let fixture: ComponentFixture<HomeLoanCombinedTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeLoanCombinedTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLoanCombinedTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
