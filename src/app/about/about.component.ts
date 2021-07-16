import { Component, OnInit, Inject } from '@angular/core';
import { baseURL } from '../shared/baseurl';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { visibility, flyInOut } from '../animations/app.animation';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    visibility(), flyInOut()
  ]
})
export class AboutComponent implements OnInit {

  leaders: Leader[]
  BaseURL;

  constructor(private leaderService: LeaderService) { 
    this.BaseURL = baseURL
  }

  ngOnInit(): void {
    this.leaderService.getLeaders()
    .subscribe((leaders) => this.leaders=leaders);
  }
}
