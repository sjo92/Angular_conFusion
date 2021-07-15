import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient) { }

  getLeaders() : Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leadership');
  }

  getLeader(id: string) : Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leadership/' + id);
  
  }
  getFeaturedLeader() : Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leadership?featured=true').pipe(map(leaders=> leaders[0]));
  }
  getLeaderIDs() : Observable<string[] |any >{
    return this.getLeaders().pipe(map(leaders=>leaders.map(leader => leader.id)));
  }

}
