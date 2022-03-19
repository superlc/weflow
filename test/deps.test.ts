import { EventEmitter } from 'events';
import { weflow } from '../src/index';
import { dsl } from './dsl/demo2';

test('测试任务间的依赖', async () => {
    const result = await weflow( new EventEmitter(), dsl);
    expect(result).toEqual({
        t1: 1,
        t2: 3,
    });
});
