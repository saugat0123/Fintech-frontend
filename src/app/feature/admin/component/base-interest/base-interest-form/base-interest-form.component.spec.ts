import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BaseInterestFormComponent } from './base-interest-form.component';

describe('BaseInterestFormComponent', () => {
  let component: BaseInterestFormComponent;
  let fixture: ComponentFixture<BaseInterestFormComponent>;

  beforeEach(waitForAsync(() => {
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
