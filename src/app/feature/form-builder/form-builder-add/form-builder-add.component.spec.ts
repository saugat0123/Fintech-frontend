import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilderAddComponent } from './form-builder-add.component';

describe('FormBuilderAddComponent', () => {
  let component: FormBuilderAddComponent;
  let fixture: ComponentFixture<FormBuilderAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormBuilderAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBuilderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
