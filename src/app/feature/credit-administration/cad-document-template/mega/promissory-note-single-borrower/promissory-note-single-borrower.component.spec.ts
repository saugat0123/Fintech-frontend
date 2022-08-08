import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromissoryNoteSingleBorrowerComponent } from './promissory-note-single-borrower.component';

describe('PromissoryNoteSingleBorrowerComponent', () => {
  let component: PromissoryNoteSingleBorrowerComponent;
  let fixture: ComponentFixture<PromissoryNoteSingleBorrowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromissoryNoteSingleBorrowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromissoryNoteSingleBorrowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
