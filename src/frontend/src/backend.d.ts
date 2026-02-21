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
    operationName: string;
    operationId: bigint;
}
export interface DailyOperationProduction {
    id: bigint;
    todayProduction: bigint;
    date: string;
    despatch: bigint;
    operationId: bigint;
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
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateTotalCompleted(operationId: bigint, date: string): Promise<bigint>;
    createDailyProductionReport(date: string, operationId: bigint, todayProduction: bigint, despatch: bigint): Promise<bigint>;
    getAllDailyProductionReports(): Promise<Array<DailyOperationProduction>>;
    getAllOperations(): Promise<Array<Operation>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getReportsByOperationAndDateRange(operationId: bigint, startDate: string, endDate: string): Promise<Array<DailyOperationProduction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateDailyProductionReport(id: bigint, newDate: string, todayProduction: bigint, despatch: bigint): Promise<boolean>;
}
