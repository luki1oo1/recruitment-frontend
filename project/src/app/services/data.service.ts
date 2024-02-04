import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { MyData } from '../components/main/main.component';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private jsonFilePath = '../../assets/data.json';

  constructor(private http: HttpClient) { }

  getJsonData(): Observable<MyData[]> {
    if (typeof window !== 'undefined') {
      const dataFromStorage = localStorage.getItem('myData');
      if (dataFromStorage) {
        return of(JSON.parse(dataFromStorage));
      } else {
        return this.http.get<MyData[]>(this.jsonFilePath).pipe(
          tap(data => {
            localStorage.setItem('myData', JSON.stringify(data));
          })
        );
      }
    } else {
      return this.http.get<MyData[]>(this.jsonFilePath);
    }
  }
}
