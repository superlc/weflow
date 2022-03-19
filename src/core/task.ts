import { WeflowEmmiter, DSL_Item, Handler } from "../types";
import { map2obj } from '../utils/index';
/**
 * 任务需要处理的几件事
 * 1. 监听依赖的其他人任务的事件
 * 2. 接收处理函数完成任务执行
 * 3. 广播自己的处理结果
 */
export class Task {
    /**
     * 任务的标识
     */
    private id: string;
    /**
     * 共享的事件处理实例
     */
    private emitter: WeflowEmmiter;
    /**
     * 任务依赖的任务id列表
     */
    private deps: Map<string, boolean>;
    /**
     * 任务处理器函数
     */
    private handler: Handler;
    /**
     * 任务执行时依赖的数据集
     */
    private dependentData: Map<string, any>;
    constructor(id: string, emitter: WeflowEmmiter, config: DSL_Item) {
        this.id = id;
        this.emitter = emitter;
        const deps = config.deps ?? [];
        this.deps = new Map();
        deps.forEach((dep) => {
            this.deps.set(dep, true);
        });
        this.dependentData = new Map();
        this.handler = config.handler;
    }
    public init() {
        const depKeys = this.deps.keys();
        for(let dep of depKeys) {
            this.emitter.once(dep, (data) => {
                this.dependentData.set(dep, data);
                this.popDep(dep);
                this.start();
            });
        }
        this.start();
    }
    private popDep(dep: string) {
        this.deps.delete(dep);
    }
    private async start() {
        if (this.deps.size > 0) {
            return;
        }
        try {
            const result = await this.handler(map2obj(this.dependentData));
            this.done(result);
        } catch (err) {
            this.fail(err);
        }
    }
    private done(result: any) {
        this.emitter.emit(this.id, result);
    }
    private fail(err: any) {
        this.emitter.emit('fail', err);
    }
}
