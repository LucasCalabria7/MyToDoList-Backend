export type TUser = {
    id: string,
    name: string,
    email: string,
    password: string
}

export type TTask = {
    id: string,
    title: string,
    description: string,
    created_at: string,
    status: number
}

export type TUserTask = {
    user_id: string,
    task_id: string
}

export type TTaskWithUsers = {
    id: string,
    title: string,
    description: string,
    created_at: string,
    status: number,
    responsibles: TUser[]
}