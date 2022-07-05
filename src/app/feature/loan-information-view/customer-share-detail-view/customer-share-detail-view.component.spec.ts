import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerShareDetailViewComponent } from './customer-share-detail-view.component';

describe('CustomerShareDetailViewComponent', () => {
  let component: CustomerShareDetailViewComponent;
  let fixture: ComponentFixture<CustomerShareDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerShareDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerShareDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
