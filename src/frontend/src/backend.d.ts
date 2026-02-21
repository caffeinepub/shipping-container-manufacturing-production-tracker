import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Operation {
    id: bigint;
    name: string;
}
export interface WorkInHandRecord {
    currentInventory: bigint;
    containerType: string;
    dispatchedQuantity: bigint;
    producedQuantity: bigint;
}
export interface DispatchRecord {
    destination: string;
    dispatchDate: string;
    containerType: string;
    trackingReference: string;
    quantity: bigint;
}
export interface DailyProductionReport {
    despatched: bigint;
    todayProduction: bigint;
    totalCompleted: bigint;
    date: string;
    inHand: bigint;
    operation: Operation;
}
export interface ProductionRecord {
    date: string;
    containerType: string;
    shift: string;
    notes: string;
    quantity: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDispatchRecord(record: DispatchRecord): Promise<void>;
    addProductionRecord(record: ProductionRecord): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createDailyProductionReport(date: string, operationId: bigint, todayProduction: bigint, despatched: bigint, inHand: bigint): Promise<bigint>;
    getAllDailyProductionReports(): Promise<Array<DailyProductionReport>>;
    getAllDispatchRecords(): Promise<Array<DispatchRecord>>;
    getAllOperations(): Promise<Array<Operation>>;
    getAllProductionRecords(): Promise<Array<ProductionRecord>>;
    getCallerRole(): Promise<string | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyProductionReport(id: bigint): Promise<DailyProductionReport | null>;
    getProductionRecordsByDateRange(startDate: string, endDate: string): Promise<Array<ProductionRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWorkInHandStatus(): Promise<Array<WorkInHandRecord>>;
    initializeDefaultReports(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(name: string): Promise<void>;
    updateDailyProductionReport(id: bigint, todayProduction: bigint, despatched: bigint, inHand: bigint): Promise<boolean>;
    updateUserRole(targetUser: Principal, newRole: string): Promise<void>;
}
