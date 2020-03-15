import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { delay, debounceTime, tap, map } from 'rxjs/operators';


@Injectable()
export class RegistrationService {
  existingUsers = [
    'user1',
    'user2',
    'user3',
    'aaaaa'
  ];

  isNotTaken(username: string): Observable<boolean> {
    return of(username).pipe(
      map(username => this.existingUsers.indexOf(username) === -1),
      delay(1000));
  }
}
