import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingUpdateComponent } from './outstanding-update.component';

describe('OutstandingUpdateComponent', () => {
  let component: OutstandingUpdateComponent;
  let fixture: ComponentFixture<OutstandingUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
