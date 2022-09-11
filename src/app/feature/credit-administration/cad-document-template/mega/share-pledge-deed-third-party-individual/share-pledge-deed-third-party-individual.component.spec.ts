import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePledgeDeedThirdPartyIndividualComponent } from './share-pledge-deed-third-party-individual.component';

describe('SharePledgeDeedThirdPartyIndividualComponent', () => {
  let component: SharePledgeDeedThirdPartyIndividualComponent;
  let fixture: ComponentFixture<SharePledgeDeedThirdPartyIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharePledgeDeedThirdPartyIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePledgeDeedThirdPartyIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
