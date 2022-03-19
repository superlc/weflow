import { Controller } from "./core/controller";
import { DSL, WeflowEmmiter } from "./types";

export const weflow = (emitter: WeflowEmmiter, dsl: DSL) => {
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
