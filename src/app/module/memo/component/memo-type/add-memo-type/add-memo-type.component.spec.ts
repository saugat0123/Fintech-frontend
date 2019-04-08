import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemoTypeComponent } from './add-memo-type.component';

describe('AddMemoTypeComponent', () => {
  let component: AddMemoTypeComponent;
  let fixture: ComponentFixture<AddMemoTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMemoTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemoTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
