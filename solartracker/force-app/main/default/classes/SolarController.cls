public class SolarController {

    @AuraEnabled
    public static void addSubscription() {
        //ReservationHandler default = new ReservationHandler();

    }

    @AuraEnabled(cacheable=true)
    public static List<Solar_System__c> getSystemNames() {
        return [SELECT Id,Name FROM Solar_System__c]; // limit 100
    }

    @AuraEnabled(cacheable=true)
    public static List<Subscription__c> getMySubscriptions() {
        String userId = Userinfo.getUserId();
        List<Subscription__c> subs = [SELECT Id,Name,Effective_Start_Date__c,Effective_End_Date__c,Solar_System__c,Solar_System__r.Name
                                        FROM Subscription__c
                                        WHERE CreatedById = :userId];

        return subs;
    }

    @AuraEnabled(cacheable=true)
    public static List<Subscription__c> getSystemSubscriptionsBySystem(String systemId) {
        return [SELECT Id,Name,Effective_Start_Date__c,Effective_End_Date__c,Solar_System__r.Name
                    FROM Subscription__c
                    WHERE Solar_System__c = :systemId
                    ORDER BY Effective_Start_Date__c DESC];
    }

    @AuraEnabled(cacheable=true)
    public static List<Subscription__c> getSystemSubscriptionsByMonth(String month) {
        Integer monthNum = Integer.valueOf(month);
        return [SELECT Id,Name,Effective_Start_Date__c,Effective_End_Date__c,Solar_System__r.Name 
                    FROM Subscription__c 
                    WHERE CALENDAR_MONTH(Effective_Start_Date__c) = :monthNum
                    ORDER BY Effective_Start_Date__c DESC];
    }

    @AuraEnabled(cacheable=true)
    public static List<Subscription__c> getSystemSubscriptionsByYear(Integer year) {
        return [SELECT Id,Name,Effective_Start_Date__c,Effective_End_Date__c,Solar_System__r.Name 
                    FROM Subscription__c 
                    WHERE CALENDAR_YEAR(Effective_Start_Date__c) = :year
                    ORDER BY Effective_Start_Date__c DESC];
    }
}

