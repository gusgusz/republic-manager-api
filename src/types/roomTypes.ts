type Room = {
    id?: number;
    userId?: number;
    nameRoom: string;
    createdAt?: Date;
    isPrivate: boolean;
}

type Task = {
    id?: number;
    roomId: number;
    nameTask: string;
    userId: number;
    dueDate: Date;
    createdAt?: Date;
    isDone?: boolean;
}

export { Room, Task};
