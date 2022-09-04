import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePledgeDeedFirstPartyIndividualComponent } from './share-pledge-deed-first-party-individual.component';

describe('SharePledgeDeedFirstPartyIndividualComponent', () => {
  let component: SharePledgeDeedFirstPartyIndividualComponent;
  let fixture: ComponentFixture<SharePledgeDeedFirstPartyIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharePledgeDeedFirstPartyIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePledgeDeedFirstPartyIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
