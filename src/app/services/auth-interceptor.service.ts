import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { from, lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private oktaAuthStateService: OktaAuthStateService, @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    // declare an array of endpoints you want to secure
    const theEndPoint = environment.luv2shopApiUrl + '/orders';
    const securedEndPoints = [theEndPoint];

    if(securedEndPoints.some(url => request.urlWithParams.includes(url))) {
      // get access token
      const accessToken = await this.oktaAuth.getAccessToken();

      // clone the request and add new header with acess token

      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }

    const nextRequest$ = next.handle(request);

    return await lastValueFrom(nextRequest$);
    // return next.handle(request).toPromise();
  }


}
