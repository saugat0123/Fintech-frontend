import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InputRadioAddComponent } from './input-radio-add.component';

describe('InputRadioAddComponent', () => {
  let component: InputRadioAddComponent;
  let fixture: ComponentFixture<InputRadioAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InputRadioAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputRadioAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
