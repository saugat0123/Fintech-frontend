import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InputArrayAddComponent } from './input-array-add.component';

describe('InputArrayAddComponent', () => {
  let component: InputArrayAddComponent;
  let fixture: ComponentFixture<InputArrayAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InputArrayAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputArrayAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
