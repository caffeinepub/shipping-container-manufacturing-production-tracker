import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DailyProductionReport {
    despatched: bigint;
    todayProduction: bigint;
    totalCompleted: bigint;
    date: string;
    operationName: string;
    inHand: bigint;
}
export interface ProductionRecord {
    date: string;
    containerType: string;
    shift: string;
    notes: string;
    quantity: bigint;
}
export interface WorkInHandRecord {
    currentInventory: bigint;
    containerType: string;
    dispatchedQuantity: bigint;
    producedQuantity: bigint;
}
export interface UserProfile {
    name: string;
}
export interface DispatchRecord {
    destination: string;
    dispatchDate: string;
    containerType: string;
    trackingReference: string;
    quantity: bigint;
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
    createDailyProductionReport(report: DailyProductionReport): Promise<bigint>;
    deleteDailyProductionReport(id: bigint): Promise<boolean>;
    getAllDailyProductionReports(): Promise<Array<DailyProductionReport>>;
    getAllDispatchRecords(): Promise<Array<DispatchRecord>>;
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
    updateDailyProductionReport(id: bigint, updatedReport: DailyProductionReport): Promise<boolean>;
    updateUserRole(targetUser: Principal, newRole: string): Promise<void>;
}
