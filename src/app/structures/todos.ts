export enum TStatus {
    Created,
    Completed,
    Failed,
    Expired
}

export interface ITodo {
    id?: string;
    content: string;
    status: TStatus;
    description?: string;
    descripcion?: string;
    createdAt?: any;
}

