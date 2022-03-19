import { DSL } from "../../src/types";

export const dsl: DSL = {
    t1: {
        handler: () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(1);
                }, 1000);
            });
        },
    },
    t2: {
        deps: ['t1'],
        handler: (deps) => {
            console.log(deps);
            const r = deps?.t1;
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve( r + 2);
                }, 1000);
            });
        },
    },
};
