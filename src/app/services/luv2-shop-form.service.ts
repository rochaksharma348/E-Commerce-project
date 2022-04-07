import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countryUrl: string = environment.luv2shopApiUrl + "/countries";
  private stateUrl: string = environment.luv2shopApiUrl + "/states";

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    const months: number[] = [];

    for(let i: number = startMonth; i <= 12; ++i) {
      months.push(i);
    }

    return of(months);
  }

  getCreditCardYears(): Observable<number[]> {

    const years: number[] = [];

    const startYear = new Date().getFullYear();
    const endYear = startYear + 10;

    for(let currYear: number = startYear; currYear <= endYear; ++currYear) {
      years.push(currYear);
    }

    return of(years);
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countryUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(countryCode: string): Observable<State[]> {

    const searchUrl = `${this.stateUrl}/search/findByCountryCode?code=${countryCode}`;

    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(
      map(response => response._embedded.states)
    );
  }

}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}










