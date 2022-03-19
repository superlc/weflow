import { DSL } from "../../src/types";

export const dsl: DSL = {
    t1: {
        handler: () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        message: 't1',
                    });
                }, 1000);
            });
        },
    },
    t2: {
        handler: () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        message: 't2',
                    });
                }, 1000);
            });
        },
    },
};
