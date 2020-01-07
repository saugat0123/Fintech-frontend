import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseInterestFormComponent } from './base-interest-form.component';

describe('BaseInterestFormComponent', () => {
  let component: BaseInterestFormComponent;
  let fixture: ComponentFixture<BaseInterestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseInterestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseInterestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
