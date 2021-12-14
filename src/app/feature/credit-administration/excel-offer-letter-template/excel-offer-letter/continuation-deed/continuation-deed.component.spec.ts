import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContinuationDeedComponent } from './continuation-deed.component';

describe('ContinuationDeedComponent', () => {
  let component: ContinuationDeedComponent;
  let fixture: ComponentFixture<ContinuationDeedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContinuationDeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContinuationDeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
