import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLoanTemplateEditComponent } from './home-loan-template-edit.component';

describe('HomeLoanTemplateEditComponent', () => {
  let component: HomeLoanTemplateEditComponent;
  let fixture: ComponentFixture<HomeLoanTemplateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeLoanTemplateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLoanTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
