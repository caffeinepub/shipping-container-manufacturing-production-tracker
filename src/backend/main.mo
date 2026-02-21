import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Array "mo:core/Array";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

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
    id : Nat;
    name : Text;
  };

  public type DailyProductionReport = {
    date : Text;
    operation : Operation;
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

  let operations = [
    { id = 1; name = "Boxing" },
    { id = 2; name = "Welding/Finishing" },
    { id = 3; name = "Rear Wall" },
    { id = 4; name = "Front Wall" },
    { id = 5; name = "Side Wall" },
    { id = 6; name = "Roof" },
    { id = 7; name = "Rear Door" },
    { id = 8; name = "Blasting & Primer" },
    { id = 9; name = "Final Paint" },
    { id = 10; name = "Gasket" },
    { id = 11; name = "DLM" },
    { id = 12; name = "Plywood" },
    { id = 13; name = "Floor Screw" },
    { id = 14; name = "Decal" },
    { id = 15; name = "Data Plate" },
    { id = 16; name = "Sikha" },
    { id = 17; name = "Black Paint" },
  ];

  var nextProductionId = 1;
  var nextDispatchId = 1;
  var nextReportId = 1;

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
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

  public shared ({ caller }) func saveCallerUserProfile(name : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, { name });
  };

  // Role management - returns role as text for frontend compatibility
  public query ({ caller }) func getCallerRole() : async ?Text {
    let role = AccessControl.getUserRole(accessControlState, caller);
    switch (role) {
      case (#admin) { ?"admin" };
      case (#user) { ?"viewer" };
      case (#guest) { null };
    };
  };

  public shared ({ caller }) func updateUserRole(targetUser : Principal, newRole : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    let mappedRole = switch (newRole) {
      case ("admin") { #admin };
      case ("viewer") { #user };
      case (_) { Runtime.trap("Invalid role: must be 'admin' or 'viewer'") };
    };
    AccessControl.assignRole(accessControlState, caller, targetUser, mappedRole);
  };

  // Production record management - admin only for mutations
  public shared ({ caller }) func addProductionRecord(record : ProductionRecord) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    productionRecords.add(nextProductionId, record);
    nextProductionId += 1;
  };

  public query ({ caller }) func getAllProductionRecords() : async [ProductionRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: User role required");
    };
    productionRecords.values().toArray();
  };

  public query ({ caller }) func getProductionRecordsByDateRange(startDate : Text, endDate : Text) : async [ProductionRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: User role required");
    };
    let filtered = productionRecords.values().filter(
      func(record) {
        record.date >= startDate and record.date <= endDate
      }
    );
    filtered.toArray();
  };

  // Dispatch record management - admin only for mutations
  public shared ({ caller }) func addDispatchRecord(record : DispatchRecord) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    dispatchRecords.add(nextDispatchId, record);
    nextDispatchId += 1;
  };

  public query ({ caller }) func getAllDispatchRecords() : async [DispatchRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: User role required");
    };
    dispatchRecords.values().toArray();
  };

  public query ({ caller }) func getWorkInHandStatus() : async [WorkInHandRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: User role required");
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

    containerTypes.map(
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
  };

  // Calculate cumulative total completed for an operation
  func calculateOperationTotalCompleted(operationId : Nat) : Nat {
    var sum = 0;
    for (report in dailyProductionReports.values()) {
      if (report.report.operation.id == operationId) {
        sum += report.report.todayProduction;
      };
    };
    sum;
  };

  // Daily Production Reports CRUD - admin only for mutations
  public shared ({ caller }) func createDailyProductionReport(
    date : Text,
    operationId : Nat,
    todayProduction : Nat,
    despatched : Nat,
    inHand : Nat,
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin role required");
    };

    let operation = switch (operations.find(func(op) { op.id == operationId })) {
      case (?op) { op };
      case (null) { Runtime.trap("Invalid operation ID") };
    };

    let operationTotal = calculateOperationTotalCompleted(operationId);

    let report : DailyProductionReport = {
      date;
      todayProduction;
      totalCompleted = operationTotal + todayProduction;
      despatched;
      inHand;
      operation;
    };

    let reportWithId = { id = nextReportId; report };
    dailyProductionReports.add(nextReportId, reportWithId);
    nextReportId += 1;
    reportWithId.id;
  };

  public query ({ caller }) func getDailyProductionReport(id : Nat) : async ?DailyProductionReport {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: User role required");
    };
    switch (dailyProductionReports.get(id)) {
      case (null) { null };
      case (?reportWithId) { ?reportWithId.report };
    };
  };

  public query ({ caller }) func getAllDailyProductionReports() : async [DailyProductionReport] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: User role required");
    };
    dailyProductionReports.values().toArray().map(
      func(reportWithId) { reportWithId.report }
    );
  };

  public shared ({ caller }) func updateDailyProductionReport(
    id : Nat,
    todayProduction : Nat,
    despatched : Nat,
    inHand : Nat,
  ) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin role required");
    };

    switch (dailyProductionReports.get(id)) {
      case (null) { false };
      case (?existingReport) {
        let operationId = existingReport.report.operation.id;
        let operationTotal = calculateOperationTotalCompleted(operationId);

        let updatedReport = {
          existingReport with
          report = {
            existingReport.report with
            todayProduction;
            totalCompleted = operationTotal + todayProduction;
            despatched;
            inHand;
          };
        };
        dailyProductionReports.add(id, updatedReport);
        true;
      };
    };
  };

  public query ({ caller }) func getAllOperations() : async [Operation] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: User role required");
    };
    operations;
  };

  public shared ({ caller }) func initializeDefaultReports() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin role required");
    };

    for (operation in operations.values()) {
      ignore await createDailyProductionReport(
        "",
        operation.id,
        0,
        0,
        0,
      );
    };
  };
};
