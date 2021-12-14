import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InputRadioFormComponent } from './input-radio-form.component';

describe('InputRadioFormComponent', () => {
  let component: InputRadioFormComponent;
  let fixture: ComponentFixture<InputRadioFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InputRadioFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputRadioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
