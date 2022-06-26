import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadedComponent } from './downloaded.component';

describe('DownloadedComponent', () => {
  let component: DownloadedComponent;
  let fixture: ComponentFixture<DownloadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
