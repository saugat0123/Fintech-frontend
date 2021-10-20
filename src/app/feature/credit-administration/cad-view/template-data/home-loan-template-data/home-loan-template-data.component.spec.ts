import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLoanTemplateDataComponent } from './home-loan-template-data.component';

describe('HomeLoanTemplateDataComponent', () => {
  let component: HomeLoanTemplateDataComponent;
  let fixture: ComponentFixture<HomeLoanTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeLoanTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLoanTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
