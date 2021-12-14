import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromissoryNoteSingleBorrowerComponent } from './promissory-note-single-borrower.component';

describe('PromissoryNoteSingleBorrowerComponent', () => {
  let component: PromissoryNoteSingleBorrowerComponent;
  let fixture: ComponentFixture<PromissoryNoteSingleBorrowerComponent>;

  beforeEach(waitForAsync(() => {
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
