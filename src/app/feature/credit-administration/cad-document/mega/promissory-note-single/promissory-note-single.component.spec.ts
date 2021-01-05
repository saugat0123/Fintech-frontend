import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNoteSingleComponent } from './promissory-note-single.component';

describe('PromissoryNoteSingleComponent', () => {
  let component: PromissoryNoteSingleComponent;
  let fixture: ComponentFixture<PromissoryNoteSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromissoryNoteSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNoteSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
