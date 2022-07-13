import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSelectAddComponent } from './input-select-add.component';

describe('InputSelectAddComponent', () => {
  let component: InputSelectAddComponent;
  let fixture: ComponentFixture<InputSelectAddComponent>;

  beforeEach(async(() => {
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
