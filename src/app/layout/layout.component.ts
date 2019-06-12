import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { ScreenMap } from '../interfaces/app.interface';

@Component({
    selector: 'app-layout',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./layout.component.scss'],
    templateUrl: './layout.component.html'
})

export class LayoutComponent implements OnInit, OnDestroy {

    public title = 'Next Gen';
    public subscription: Subscription[] = [];
    public accrualSearchPurAgmtUrl: string;
    public accrualSearchSalesUrl: string;
    public accrualReviewSalesUrl: string;
    private accrualUrl: string;
    private accrualBatchUrl: string;
    public accrualReviewUrl: string;
    private salesAccuralScreenTestUrl: string;
    public _currentYear: number;
    public _version: string;
    public directInvoiceUrl: string;
    public invoiceSearchUrl: string;
    public testScreenExecuteAccess: boolean;
    public screenQueryIdMap = new Map<string, string>();

    constructor(private appService: AppService, private router: Router) {
        this._currentYear = new Date().getFullYear();
    }

    ngOnInit() {
        const baseUrl = document.location.href;
        let role: string;
        this.checkVersion();
        this.appService.fetchScreenMap().subscribe((res: ScreenMap) => {
            this.screenQueryIdMap = res.results;
        });
    }

    public logoutUser() {
    }

    ngOnDestroy() {
        this.subscription.forEach(sub => sub.unsubscribe());
    }

    getHeaderTitle() {
        return this.title;
    }

    getTitle() {
        return 'Generic Search';
    }

    checkVersion() {
    }

}
