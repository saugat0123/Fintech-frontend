import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewtWorthComponent } from './newt-worth.component';

describe('NewtWorthComponent', () => {
  let component: NewtWorthComponent;
  let fixture: ComponentFixture<NewtWorthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewtWorthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewtWorthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
