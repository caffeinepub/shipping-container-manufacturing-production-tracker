import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

module {
  type OldUserProfile = {
    name : Text;
  };

  type OldProductionRecord = {
    date : Text;
    containerType : Text;
    quantity : Nat;
    shift : Text;
    notes : Text;
  };

  type OldDispatchRecord = {
    dispatchDate : Text;
    quantity : Nat;
    destination : Text;
    trackingReference : Text;
    containerType : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    productionRecords : Map.Map<Nat, OldProductionRecord>;
    dispatchRecords : Map.Map<Nat, OldDispatchRecord>;
    nextProductionId : Nat;
    nextDispatchId : Nat;
  };

  type NewDailyProductionReport = {
    date : Text;
    operationName : Text;
    todayProduction : Nat;
    totalCompleted : Nat;
    despatched : Nat;
    inHand : Nat;
  };

  type NewDailyProductionReportWithId = {
    id : Nat;
    report : NewDailyProductionReport;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    productionRecords : Map.Map<Nat, OldProductionRecord>;
    dispatchRecords : Map.Map<Nat, OldDispatchRecord>;
    dailyProductionReports : Map.Map<Nat, NewDailyProductionReportWithId>;
    nextProductionId : Nat;
    nextDispatchId : Nat;
    nextReportId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newDailyProductionReports = Map.empty<Nat, NewDailyProductionReportWithId>();

    {
      old with
      dailyProductionReports = newDailyProductionReports;
      nextReportId = 1;
    };
  };
};
