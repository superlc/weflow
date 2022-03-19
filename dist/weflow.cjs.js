'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const map2obj = (map) => {
    const obj = Object.create(null);
    map.forEach((val, k) => {
        obj[k] = val;
    });
    return obj;
};

/**
 * 任务需要处理的几件事
 * 1. 监听依赖的其他人任务的事件
 * 2. 接收处理函数完成任务执行
 * 3. 广播自己的处理结果
 */
class Task {
    constructor(id, emitter, config) {
        var _a;
        this.id = id;
        this.emitter = emitter;
        const deps = (_a = config.deps) !== null && _a !== void 0 ? _a : [];
        this.deps = new Map();
        deps.forEach((dep) => {
            this.deps.set(dep, true);
        });
        this.dependentData = new Map();
        this.handler = config.handler;
    }
    init() {
        const depKeys = this.deps.keys();
        for (let dep of depKeys) {
            this.emitter.once(dep, (data) => {
                this.dependentData.set(dep, data);
                this.popDep(dep);
                this.start();
            });
        }
        this.start();
    }
    popDep(dep) {
        this.deps.delete(dep);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.deps.size > 0) {
                return;
            }
            try {
                const result = yield this.handler(map2obj(this.dependentData));
                this.done(result);
            }
            catch (err) {
                this.fail(err);
            }
        });
    }
    done(result) {
        this.emitter.emit(this.id, result);
    }
    fail(err) {
        this.emitter.emit('fail', err);
    }
}

class Controller {
    constructor(emitter) {
        this.emitter = emitter;
        this.tasks = new Map();
        this.result = {};
    }
    init(dsl) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    done(id) {
        this.tasks.delete(id);
        if (this.tasks.size <= 0) {
            this.allDone();
        }
    }
    allDone() {
        this.emitter.emit('success', Object.assign({}, this.result));
    }
}

const weflow = (emitter, dsl) => {
    const controller = new Controller(emitter);
    controller.init(dsl);
    return new Promise((resolve, reject) => {
        emitter.once('fail', (err) => {
            reject(err);
        });
        emitter.once('success', (data) => {
            resolve(data);
        });
    });
};

exports.weflow = weflow;
