import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DpNoteBorrowerComponent } from './dp-note-borrower.component';

describe('DpNoteBorrowerComponent', () => {
  let component: DpNoteBorrowerComponent;
  let fixture: ComponentFixture<DpNoteBorrowerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DpNoteBorrowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpNoteBorrowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
