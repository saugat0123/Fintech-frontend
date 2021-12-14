import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DetailViewBaseComponent } from './detail-view-base.component';

describe('DetailViewBaseComponent', () => {
  let component: DetailViewBaseComponent;
  let fixture: ComponentFixture<DetailViewBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailViewBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailViewBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
