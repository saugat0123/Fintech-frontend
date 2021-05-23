import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinuationDeedComponent } from './continuation-deed.component';

describe('ContinuationDeedComponent', () => {
  let component: ContinuationDeedComponent;
  let fixture: ComponentFixture<ContinuationDeedComponent>;

  beforeEach(async(() => {
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
