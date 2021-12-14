import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InputSelectAddComponent } from './input-select-add.component';

describe('InputSelectAddComponent', () => {
  let component: InputSelectAddComponent;
  let fixture: ComponentFixture<InputSelectAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InputSelectAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSelectAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
