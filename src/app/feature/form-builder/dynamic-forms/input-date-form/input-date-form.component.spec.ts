import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InputDateFormComponent } from './input-date-form.component';

describe('InputDateFormComponent', () => {
  let component: InputDateFormComponent;
  let fixture: ComponentFixture<InputDateFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InputDateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
