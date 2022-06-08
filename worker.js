const { workerData, parentPort } = require('worker_threads')

const task = workerData;
for (let i = 0; i < task.length; ++i) {
    for (let j = 0; j < 20000; ++j) {
        task[i]++;
    }
}

parentPort.postMessage(task)
