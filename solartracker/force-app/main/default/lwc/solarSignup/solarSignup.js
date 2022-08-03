import { LightningElement, wire,track } from "lwc";
import getMySubscriptions from '@salesforce/apex/SolarController.getMySubscriptions';
import addSubscription from '@salesforce/apex/SolarController.addSubscription'; 

// unsubscribe
// subscripbe
// test
// mdt

var mySubscriptionActions = [    
    { label: 'Unsubscribe from System', name: 'unsubscribe' }
];

var mySubscriptionColumns = [
    { label: 'Subscription Name', fieldName: 'name' },
    { label: 'System Name', fieldName: 'systemName' },
    { label: 'Start Date', fieldName: 'startDate' },
    { label: 'End Date', fieldName: 'endDate' },
    {
        type: 'action',
        typeAttributes: { rowActions: mySubscriptionActions },
    }
];

export default class SolarSignup extends LightningElement {
    systemId;
    solarsystem = '';

    @track
    allMySubscriptionData = [];
    subscriptionName = '';

    columns = mySubscriptionColumns;

    @wire(getMySubscriptions)
    mySubscriptions

    get mySubscriptionData() {
        if(this.mySubscriptions.data) {
            return this.mySubscriptions.data.map((el) => {
                return {
                    name:el.Name,
                    systemName:el[`Solar_System__r`][`Name`],
                    startDate: el.Effective_Start_Date__c,
                    endDate: el.Effective_End_Date__c
                };
            });
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'unsubscribe':
                console.log(`unsubscribe`);
                break;
            default:
        }
    }

    datesAvailable(daterange) {
        for(let i = 0; i < this.selectedSubcriptionDates.length; i++) {
            //console.log(`   reserved date: ${JSON.stringify(this.selectedSubcriptionDates[i])}`);
            const reservedStart = new Date(`{${this.selectedSubcriptionDates[i].Effective_Start_Date__c}`);
            const reservedEnd = new Date(`${this.selectedSubcriptionDates[i].Effective_End_Date__c}`);
            if((daterange.startdate >= reservedStart && daterange.startdate <= reservedEnd) 
                || daterange.enddate >= reservedStart && daterange.enddate <= reservedEnd) {
                return false;
            }
        }
        return true;
    }

    handleInputChange(event) {
      this.subscriptionName = event.detail.value
    }

    handleSubscribe(e){
        console.log(this.solarsystem);
        console.log(this.subscriptionName);
    }
}

