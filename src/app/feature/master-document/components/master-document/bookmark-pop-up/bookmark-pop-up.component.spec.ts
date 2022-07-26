import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkPopUpComponent } from './bookmark-pop-up.component';

describe('BookmarkPopUpComponent', () => {
  let component: BookmarkPopUpComponent;
  let fixture: ComponentFixture<BookmarkPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
