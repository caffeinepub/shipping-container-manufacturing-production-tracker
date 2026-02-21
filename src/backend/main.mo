import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";

import Array "mo:core/Array";
import Migration "migration";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Apply migration on upgrade automatically using actor's with clause
(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type ProductionRecord = {
    date : Text;
    containerType : Text;
    quantity : Nat;
    shift : Text;
    notes : Text;
  };

  public type DispatchRecord = {
    dispatchDate : Text;
    quantity : Nat;
    destination : Text;
    trackingReference : Text;
    containerType : Text;
  };

  public type WorkInHandRecord = {
    containerType : Text;
    producedQuantity : Nat;
    dispatchedQuantity : Nat;
    currentInventory : Nat;
  };

  public type Operation = {
    operationId : Nat;
    operationName : Text;
  };

  public type DailyOperationProduction = {
    id : Nat;
    date : Text;
    operationId : Nat;
    todayProduction : Nat;
    despatch : Nat;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let productionRecords = Map.empty<Nat, ProductionRecord>();
  let dispatchRecords = Map.empty<Nat, DispatchRecord>();

  var operations = Map.empty<Nat, Operation>();
  var dailyOperationProduction = Map.empty<Nat, DailyOperationProduction>();

  var nextProductionId = 1;
  var nextDispatchId = 1;
  var nextReportId = 1;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Corrected function to sum today's production across all dates for a given operation
  public shared ({ caller }) func calculateTotalCompleted(operationId : Nat, date : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: User role required");
    };

    var sum = 0;
    for (record in dailyOperationProduction.values()) {
      if (record.operationId == operationId and record.date <= date) {
        sum += record.todayProduction;
      };
    };
    sum;
  };

  public query ({ caller }) func getAllOperations() : async [Operation] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: User role required");
    };

    // Transform map into array (1 to 17, ordered by operationId)
    let result = Array.tabulate(
      17,
      func(i) {
        let operationId = i + 1;
        switch (operations.get(operationId)) {
          case (?operation) { operation };
          case (null) {
            { operationId; operationName = "" };
          };
        };
      },
    );
    result;
  };

  public shared ({ caller }) func updateDailyProductionReport(
    id : Nat,
    newDate : Text,
    todayProduction : Nat,
    despatch : Nat,
  ) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin role required");
    };

    switch (dailyOperationProduction.get(id)) {
      case (null) {
        Runtime.trap("Report not found");
      };
      case (?existingReport) {
        let updatedReport : DailyOperationProduction = {
          id;
          date = newDate;
          operationId = existingReport.operationId;
          todayProduction;
          despatch;
        };

        dailyOperationProduction.add(id, updatedReport);
        true;
      };
    };
  };

  public shared ({ caller }) func createDailyProductionReport(
    date : Text,
    operationId : Nat,
    todayProduction : Nat,
    despatch : Nat,
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin role required");
    };

    if (operationId < 1 or operationId > 17) {
      Runtime.trap("Invalid operation ID. Must be between 1 and 17");
    };

    switch (operations.get(operationId)) {
      case (null) {
        Runtime.trap("Invalid operation ID. Operation does not exist");
      };
      case (?_) {};
    };

    let report : DailyOperationProduction = {
      id = nextReportId;
      date;
      operationId;
      todayProduction;
      despatch;
    };

    dailyOperationProduction.add(nextReportId, report);
    let createdId = nextReportId;
    nextReportId += 1;
    createdId;
  };

  public query ({ caller }) func getAllDailyProductionReports() : async [DailyOperationProduction] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: User role required");
    };
    dailyOperationProduction.values().toArray();
  };

  public query ({ caller }) func getReportsByOperationAndDateRange(
    operationId : Nat,
    startDate : Text,
    endDate : Text,
  ) : async [DailyOperationProduction] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: User role required");
    };

    let filtered = dailyOperationProduction.values().filter(
      func(report) {
        report.operationId == operationId and report.date >= startDate and report.date <= endDate
      }
    );
    filtered.toArray();
  };

  // Private system-internal function to initialize default operations
  // This is called automatically during migration and should not be publicly accessible
  func initializeOperations() {
    operations := Map.empty<Nat, Operation>();
    let operationList = [
      (1, "Boxing"),
      (2, "Welding/Finishing"),
      (3, "Rear Wall"),
      (4, "Front Wall"),
      (5, "Side Wall"),
      (6, "Roof"),
      (7, "Rear Door"),
      (8, "Blasting & Primer"),
      (9, "Final Paint"),
      (10, "Gasket"),
      (11, "DLM"),
      (12, "Plywood"),
      (13, "Floor Screw"),
      (14, "Decal"),
      (15, "Data Plate"),
      (16, "Sikha"),
      (17, "Black Paint"),
    ];

    for ((operationId, operationName) in operationList.values()) {
      operations.add(operationId, {
        operationId;
        operationName;
      });
    };
  };

  // Initialize operations on first deployment
  initializeOperations();
};
