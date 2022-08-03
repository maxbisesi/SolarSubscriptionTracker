@IsTest
public class SolarControllerTest {

    @testSetup
    static void testSetup() {
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com', 
            EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US', 
            LocaleSidKey='en_US', ProfileId = p.Id, 
            TimeZoneSidKey='America/Los_Angeles', UserName='maxbisesiqa@testorg.com');
        insert u;

        Solar_System__c ss = new Solar_System__c(Name='Cool System');
        insert ss;
        Subscription__c sub = new Subscription__c(Name='Subscription One');
        System.runAs(u) {
            insert sub;
        }
    }

    @IsTest
    public static void testGetMySubscriptions() {
        User u = [SELECT Id FROM User WHERE UserName = 'maxbisesiqa@testorg.com'];
        List<Subscription__c> subs = SolarController.getMySubscriptions(u.Id);
        System.debug(subs);
        System.assert(subs.size() == 1);
        System.assertEquals(subs[0].Name,'Subscription One');
        System.assertEquals(subs[0].SolarSubscriptions__r.size(),1);
    }

}
