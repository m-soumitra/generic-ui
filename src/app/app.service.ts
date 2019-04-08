import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Results } from './case-enquiry/case-enquiry.component';
import { SearchRequest } from './case-enquiry/case-enquiry.component';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    private screenCreationResponse = '';
    private gridResponseUrl = '';

    constructor(private httpClient: HttpClient) { }

    public fetchScreenCreateRespone(queryId: string) {
        console.log('env.prod', environment.production );
        if (environment.production) {
            const reuqestParams = new HttpParams().set('queryId', queryId);
            return this.httpClient.get(environment.nameScreenUrl, { params: reuqestParams }).pipe(
                map((response: Response) => response),
                catchError(this.handleError));
        } else {
            if (queryId === 'name') {
                return this.httpClient.get(environment.nameScreenUrl).pipe(
                    map((response: Response) => response),
                    catchError(this.handleError));
            } else if (queryId === 'ssn') {
                return this.httpClient.get(environment.ssnScreenUrl).pipe(
                    map((response: Response) => response),
                    catchError(this.handleError));
            }
        }
    }


    public fetchGridResponse(searchRequest: SearchRequest, queryId?: string) {
        console.log('Search Request: ', searchRequest);
        if (environment.production) {
            return this.httpClient.post(environment.gridResponseUrl, searchRequest).pipe(
                map((response: Response) => response),
                catchError(this.handleError));
        } else {
            return this.httpClient.get(environment.gridResponseUrl).pipe(
                map((response: Response) => response),
                catchError(this.handleError));
        }

    }

    private handleError(error: HttpErrorResponse) {
        return throwError(error.error || 'Server error');
    }


}
