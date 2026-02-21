import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
  type OldActor = {
    operationsInitialized : Bool;
    var operations : Map.Map<Nat, Operation>;
  };

  type Operation = {
    operationId : Nat;
    operationName : Text;
  };

  public func run(old : OldActor) : { var operations : Map.Map<Nat, Operation> } {
    let newOperations = Map.empty<Nat, Operation>();
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
      newOperations.add(operationId, {
        operationId;
        operationName;
      });
    };
    { var operations = newOperations };
  };
};
