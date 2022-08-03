import { LightningElement,track,wire,api } from 'lwc';
import getSystemNames from '@salesforce/apex/SolarController.getSystemNames';
import getSystemSubscriptionsByYear from '@salesforce/apex/SolarController.getSystemSubscriptionsByYear';
import getSystemSubscriptionsByMonth from '@salesforce/apex/SolarController.getSystemSubscriptionsByMonth';
import getSystemSubscriptionsBySystem from '@salesforce/apex/SolarController.getSystemSubscriptionsBySystem';

export default class SubDatePicker extends LightningElement {
    systemId;
    filterMonth;
    filterYear;

    @track 
    dates = [];

    systemSubs = [];
    monthSubs = [];
    yearSubs = []

    @track
    subs;

    connectedCallback() {

    }

    @wire(getSystemNames)
    systemOptions;

    @wire(getSystemSubscriptionsBySystem,{systemId: '$systemId'})
    subsBySystem({ error, data }){
        //console.log(`system data: ${JSON.stringify(data)}`);
        if(data) {
            this.dates.push(...data);
            this.systemSubs.push(data.map((d => d.Id)));
        }
    }
    @wire(getSystemSubscriptionsByMonth,{month: '$filterMonth'}) 
    subsByMonth({ error, data }){
        //console.log(`month data: ${JSON.stringify(data)}`);
        if(data) {
            this.dates.push(...data); 
            this.monthSubs.push(data.map((d => d.Id)));
        }
    }
    @wire(getSystemSubscriptionsByYear,{year: '$filterYear'}) 
    subsByYear({ error, data }){
        //console.log(`year data: ${JSON.stringify(data)}`);
        if(data) {
            this.dates.push(...data);
            this.yearSubs.push(data.map((d => d.Id)));
        }
    }

    get dateList() {
        console.log('get dateList()');
        this.findVacancies(this.dates);
        return this.dates;
    }

    findVacancies(dtList) {
        // Sort by date and system.
        const N = dtList.length;
        const sysMap = new Map();
        for(let i = 0; i < N; i++) {
            const subItem = {'Id': dtList[i].Id,
                            'Name': dtList[i].Solar_System__r.Name,
                            'Start':new Date(dtList[i].Effective_Start_Date__c), 
                            'End': new Date(dtList[i].Effective_End_Date__c)};
            if(sysMap.has(dtList[i].Solar_System__c)) {
                sysMap.get(dtList[i].Solar_System__c).push(subItem);
            } else {
                sysMap.set(dtList[i].Solar_System__c,[subItem]);
            }
        }

        sysMap.forEach((value, key) => {
            console.log(`m[${key}] = ${value}`);
        });
    }

    get options() {
        if(this.systemOptions.data) {
            return this.systemOptions.data.map((item) => {
                return { label: item.Name, value: item.Id }
            });
        } else {
            return [
                { label: 'default', value: null }
            ];
        }
    }

    get months() {
        var month = 0;
        var monthStrings = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];
        return monthStrings.map(item => {
            return {label: item, value: `${++month}` };
        });
    }

    get years() {
        var years = [];
        for(let y = 2019; y < 2050; y++) {
            years.push(y+'');
        }
        return years.map((item) => {
            return { label: item, value: item };
        });
    }

    handleComboChange(event) {
        this.systemId = event.detail.value;
    }

    handleClear() {
        this.filterMonth = null;
        this.filterYear = null;
        this.systemId = null;
        // potential memory leak...
        this.dates = [];
    }

    handleMonthChange(event) {
        this.filterMonth = event.detail.value; 
    }

    handleYearChange(event) {
        this.filterYear = event.detail.value;
    }

    removeSystemFilter() {
        this.dates = this.dates.filter(d => !this.systemSubs.includes(d.Id));
    }

    removeMonthFilter() {

    }

    removeYearFilter() {

    }

}