import { EventEmitter } from 'events';
import { weflow } from '../src/index';
import { dsl } from './dsl/demo1';

test('普通并行任务测试', async () => {
    const result = await weflow( new EventEmitter(), dsl);
    expect(result).toEqual({
        t1: {
            message: 't1',
        },
        t2: {
            message: 't2',
        },
    });
});
