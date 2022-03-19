import { DSL, WeflowEmmiter } from "../types";
import { Task } from "./task";

export class Controller {
    private emitter: WeflowEmmiter;
    private tasks: Map<string, Task>;
    private result: { [k: string]: any };
    constructor(emitter: WeflowEmmiter) {
        this.emitter = emitter;
        this.tasks = new Map();
        this.result = {};
    }
    public async init(dsl: DSL) {
        const ids = Object.keys(dsl);
        ids.forEach((id) => {
            // 构造任务
            const t = new Task(id, this.emitter, dsl[id]);
            this.tasks.set(id, t);
            // 监听任务成功执行的事件
            this.emitter.once(id, (result) => {
                console.log(`Task::${id}已完成`, result);
                // 挂载数据到result上
                this.result[id] = result;
                this.done(id);
            });
            t.init();
        });
    }
    private done(id: string) {
        this.tasks.delete(id);
        if (this.tasks.size <= 0) {
            this.allDone();
        }
    }
    private allDone() {
        this.emitter.emit('success', Object.assign({}, this.result));
    }
}