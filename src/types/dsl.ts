import { PlainObject } from "./base";

export interface Handler {
    (deps?: PlainObject): Promise<any>;
}

export interface DSL_Item {
    // 依赖的任务名列表
    deps?: string[],
    // 任务的处理函数，只约束返回值为Promise类型
    handler: Handler,
}

export interface DSL {
    [k: string]: DSL_Item,
}
