/**
 * VisualPatch Autonomous Live Inbox Watcher
 * Waits for .visualpatch/inbox.md updates and wakes up the AI agent
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const inboxDir = path.join(projectRoot, '.visualpatch');
const inboxFile = path.join(inboxDir, 'inbox.md');

if (!fs.existsSync(inboxDir)) {
  fs.mkdirSync(inboxDir, { recursive: true });
}

let initialMtime = 0;
if (fs.existsSync(inboxFile)) {
  try {
    initialMtime = fs.statSync(inboxFile).mtimeMs;
  } catch (e) {}
}

console.log('⚡ VisualPatch live watcher armed. Send feedback from the browser (Ctrl+Enter)...');

const intervalId = setInterval(() => {
  if (fs.existsSync(inboxFile)) {
    try {
      const currentMtime = fs.statSync(inboxFile).mtimeMs;
      if (currentMtime > initialMtime) {
        clearInterval(intervalId);
        console.log(`[VISUALPATCH_LIVE] New UI feedback task detected in .visualpatch/inbox.md`);
        process.exit(0);
      }
    } catch (e) {}
  }
}, 350);
