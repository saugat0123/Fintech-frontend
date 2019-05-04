import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddNepseComponent} from './add-nepse.component';

describe('AddNepseComponent', () => {
  let component: AddNepseComponent;
  let fixture: ComponentFixture<AddNepseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNepseComponent]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNepseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
