import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePledgeSecuritiesComponent } from './share-pledge-securities.component';

describe('SharePledgeSecuritiesComponent', () => {
  let component: SharePledgeSecuritiesComponent;
  let fixture: ComponentFixture<SharePledgeSecuritiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharePledgeSecuritiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePledgeSecuritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
