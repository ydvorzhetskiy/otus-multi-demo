const express = require('express');
const { spawn } = require('node:child_process');
const { Worker } = require('worker_threads')

const app = express();

app.get('/', (req, res) => {

    const task = Array(100000);

    const worker = new Worker('./worker.js', {workerData: task});
    worker.on('message', (calculatedTask) => {
        res.contentType('text/html');
        res.write(`
            <html lang="en">
            <body>
                <h1>Calculated length = ${calculatedTask.length}</h1>
            </body>
            </html>
        `);
        res.end();
    });
})

function calculateTask(task, callback) {
    const n = 8;
    let k = 0
    function extracted() {
        for (let i = (task.length / n) * k; i < (task.length / n) * (k + 1); ++i) {
            task[i] = 0;
            for (let j = 0; j < 20000; ++j) {
                task[i]++;
            }
        }
        k++;
        if (k < n) {
            setImmediate(() => extracted());
        } else {
            callback(task)
        }
    }
    setImmediate(() => extracted())
}

app.get('/simple', (req, res) => {
    res.json({})
})

app.listen(3000);
