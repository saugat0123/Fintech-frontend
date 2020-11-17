import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDateFormComponent } from './input-date-form.component';

describe('InputDateFormComponent', () => {
  let component: InputDateFormComponent;
  let fixture: ComponentFixture<InputDateFormComponent>;

  beforeEach(async(() => {
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
