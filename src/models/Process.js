import { types } from 'mobx-state-tree';
import uuid from 'uuid';
import { toJS } from 'mobx';
import { PROCESS_STATUS } from 'config/enums';
import { remote } from 'electron';

import Project from './Project';

//native
const childProcess = remote.require('child_process');
const readline = remote.require('readline');

export default types
  .model('Process', {
    id: types.optional(types.identifier(), () => uuid.v4()),
    project: types.maybe(types.reference(types.late(() => Project))),
    output: '',
    running: false,
    code: types.maybe(types.number),
    path: '',
    command: '',
    argz: types.optional(types.array(types.string), []),
    chunkedOutput: types.optional(types.array(types.string), [])
  })
  .actions(self => {
    let proc;
    let resolve;
    let extra;

    return {
      stop: () => {
        self.running = false;
        try {
          process.kill(-proc.pid);
          resolve(-1);
        } catch (err) {
          console.error(err);
        }
      },
      onOutput: data => {
        let newOutput = self.output + '\n' + data.toString();
        self.output = newOutput.trim();
        self.chunkedOutput.push(data.toString().trim());
      },
      clearOutput: () => {
        self.output = '';
      },
      restart: () => {
        self.output = '';
        self.stop();
        setTimeout(() => {
          self.start();
        }, 500);
      },
      start: () => {
        self.running = true;

        console.log('extra is', extra);

        console.log('starting', self.command, toJS(self.argz), {
          cwd: self.path,
          ...extra
        });

        try {
          proc = childProcess.spawn(self.command, toJS(self.argz), {
            cwd: self.path,
            shell: true,
            detached: true,
            ...extra
          });

          readline
            .createInterface({
              input: proc.stdout,
              terminal: true
            })
            .on('line', self.onOutput);

          readline
            .createInterface({
              input: proc.stderr,
              terminal: true
            })
            .on('line', self.onOutput);

          // process.stdout.on('data', self.onOutput);
          proc.on('exit', self.onExit);
          proc.on('error', self.onError);
          proc.on('message', self.onMessage);
          proc.on('close', self.onClose);
        } catch (err) {
          console.log(`error starting process`, err);
        }
      },
      attach: (command, argz, path, extraOptions) => {
        self.path = path;
        self.argz = argz;
        self.command = command;
        extra = extraOptions;
        self.start();
        return new Promise(res => {
          resolve = res;
        });
      },
      onClose: (code, signal) => {
        console.log('close', code, signal);
      },
      disconnect: () => {
        console.log('disconnect');
      },
      onError: error => {
        alert(error);
        self.running = false;
      },
      onMessage: message => {},
      onExit: (code, signal) => {
        console.log('exit with', code, signal);
        self.code = code;
        self.running = false;
        resolve(code);
      }
    };
  })
  .views(self => ({
    get status() {
      if (self.running) {
        return PROCESS_STATUS.RUNNING;
      }

      if (!self.running && self.code === 1) {
        return PROCESS_STATUS.ERROR;
      }

      return PROCESS_STATUS.NONE;
    },
    get title() {
      return [self.path, '>', self.fullCommand].join(' ');
    },
    get fullCommand() {
      return [self.command, self.argz && self.argz.join(' ')].join(' ');
    }
  }));
