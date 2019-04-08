import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMemoTypeComponent } from './delete-memo-type.component';

describe('DeleteMemoTypeComponent', () => {
  let component: DeleteMemoTypeComponent;
  let fixture: ComponentFixture<DeleteMemoTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteMemoTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMemoTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
