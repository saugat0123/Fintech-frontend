import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousCommentsComponent } from './previous-comments.component';

describe('PreviousCommentsComponent', () => {
  let component: PreviousCommentsComponent;
  let fixture: ComponentFixture<PreviousCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
