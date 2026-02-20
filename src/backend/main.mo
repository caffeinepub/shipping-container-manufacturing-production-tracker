import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Migration "migration";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Use with-clause to install migration on upgrade.
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

  public type DailyProductionReport = {
    date : Text;
    operationName : Text;
    todayProduction : Nat;
    totalCompleted : Nat;
    despatched : Nat;
    inHand : Nat;
  };

  public type DailyProductionReportWithId = {
    id : Nat;
    report : DailyProductionReport;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let productionRecords = Map.empty<Nat, ProductionRecord>();
  let dispatchRecords = Map.empty<Nat, DispatchRecord>();
  let dailyProductionReports = Map.empty<Nat, DailyProductionReportWithId>();

  var nextProductionId = 1;
  var nextDispatchId = 1;
  var nextReportId = 1;

  // User profile management
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

  // Production record management
  public shared ({ caller }) func addProductionRecord(record : ProductionRecord) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add production records");
    };
    productionRecords.add(nextProductionId, record);
    nextProductionId += 1;
  };

  public query ({ caller }) func getAllProductionRecords() : async [ProductionRecord] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view production records");
    };
    productionRecords.values().toArray();
  };

  public query ({ caller }) func getProductionRecordsByDateRange(startDate : Text, endDate : Text) : async [ProductionRecord] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view production records");
    };
    let filtered = productionRecords.values().filter(
      func(record) {
        record.date >= startDate and record.date <= endDate
      }
    );
    filtered.toArray();
  };

  // Dispatch record management
  public shared ({ caller }) func addDispatchRecord(record : DispatchRecord) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add dispatch records");
    };
    dispatchRecords.add(nextDispatchId, record);
    nextDispatchId += 1;
  };

  public query ({ caller }) func getAllDispatchRecords() : async [DispatchRecord] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view dispatch records");
    };
    dispatchRecords.values().toArray();
  };

  // Work-in-hand status
  public query ({ caller }) func getWorkInHandStatus() : async [WorkInHandRecord] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view work-in-hand status");
    };

    let producedByType = Map.empty<Text, Nat>();
    let dispatchedByType = Map.empty<Text, Nat>();

    for (record in productionRecords.values()) {
      let current = switch (producedByType.get(record.containerType)) {
        case (null) { 0 };
        case (?value) { value };
      };
      producedByType.add(record.containerType, current + record.quantity);
    };

    for (record in dispatchRecords.values()) {
      let current = switch (dispatchedByType.get(record.containerType)) {
        case (null) { 0 };
        case (?value) { value };
      };
      dispatchedByType.add(record.containerType, current + record.quantity);
    };

    let containerTypes = producedByType.keys().toArray();

    let workInHandArray = containerTypes.map(
      func(containerType) {
        let produced = switch (producedByType.get(containerType)) {
          case (null) { 0 };
          case (?value) { value };
        };
        let dispatched = switch (dispatchedByType.get(containerType)) {
          case (null) { 0 };
          case (?value) { value };
        };
        {
          containerType;
          producedQuantity = produced;
          dispatchedQuantity = dispatched;
          currentInventory = produced - dispatched;
        };
      }
    );
    workInHandArray;
  };

  // Daily Production Report CRUD Functions
  public shared ({ caller }) func createDailyProductionReport(report : DailyProductionReport) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create production reports");
    };
    let reportWithId = { id = nextReportId; report };
    dailyProductionReports.add(nextReportId, reportWithId);
    nextReportId += 1;
    reportWithId.id;
  };

  public query ({ caller }) func getDailyProductionReport(id : Nat) : async ?DailyProductionReport {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can retrieve production reports");
    };
    switch (dailyProductionReports.get(id)) {
      case (null) { null };
      case (?reportWithId) { ?reportWithId.report };
    };
  };

  public query ({ caller }) func getAllDailyProductionReports() : async [DailyProductionReport] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can retrieve production reports");
    };
    dailyProductionReports.values().toArray().map(
      func(reportWithId) {
        reportWithId.report;
      }
    );
  };

  public shared ({ caller }) func updateDailyProductionReport(id : Nat, updatedReport : DailyProductionReport) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update production reports");
    };
    switch (dailyProductionReports.get(id)) {
      case (null) { false };
      case (?_) {
        dailyProductionReports.add(id, { id; report = updatedReport });
        true;
      };
    };
  };

  public shared ({ caller }) func deleteDailyProductionReport(id : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete production reports");
    };
    switch (dailyProductionReports.get(id)) {
      case (null) { false };
      case (?_) {
        dailyProductionReports.remove(id);
        true;
      };
    };
  };

  // Initialize default operation names
  public shared ({ caller }) func initializeDefaultReports() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can initialize default reports");
    };

    let defaultOperations = [
      "Boxing",
      "Welding/Finishing",
      "Rear Wall",
      "Front Wall",
      "Side Wall",
      "Roof",
      "Rear Door",
      "Blasting & Primer",
      "Final Paint",
      "Gasket",
      "DLM",
      "Plywood",
      "Floor Screw",
      "Decal",
      "Data Plate",
      "Sikha",
      "Black Paint",
    ];

    for (operation in defaultOperations.values()) {
      let report : DailyProductionReport = {
        date = "";
        operationName = operation;
        todayProduction = 0;
        totalCompleted = 0;
        despatched = 0;
        inHand = 0;
      };
      ignore createDailyProductionReport(report);
    };
  };
};
