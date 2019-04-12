import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddSubSegmentComponent} from './add-sub-segment.component';

describe('AddSubSegmentComponent', () => {
  let component: AddSubSegmentComponent;
  let fixture: ComponentFixture<AddSubSegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddSubSegmentComponent]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
