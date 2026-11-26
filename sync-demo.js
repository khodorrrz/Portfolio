const demo = document.querySelector('.sync-demo');
const next = document.querySelector('#sync-next');
const status = document.querySelector('#sync-status');
const stage = document.querySelector('#sync-stage');
const price = document.querySelector('#sync-price');

const steps = {
  idle: {
    phase: 'idle',
    stage: 'Idle',
    price: '$2.50',
    status: 'Sample event 1042 is waiting to be sent.',
    label: 'Receive event'
  },
  receive: {
    phase: 'receive',
    stage: 'Staged',
    price: '$2.50',
    status: 'Received sample event 1042 from the cloud stream and staged it locally.',
    label: 'Apply locally'
  },
  apply: {
    phase: 'apply',
    stage: 'Applied',
    price: '$2.75',
    status: 'Updated the local record to $2.75.',
    label: 'Acknowledge'
  },
  ack: {
    phase: 'ack',
    stage: 'Acknowledged',
    price: '$2.75',
    status: 'Acknowledged event 1042 after the local write.',
    label: 'Start over'
  }
};
const order = ['idle', 'receive', 'apply', 'ack'];
let current = 'idle';

function renderStep(name) {
  const step = steps[name];
  demo.dataset.phase = step.phase;
  stage.textContent = step.stage;
  price.textContent = step.price;
  status.textContent = step.status;
  next.textContent = step.label;
}

next.addEventListener('click', () => {
  current = current === 'ack' ? 'idle' : order[order.indexOf(current) + 1];
  renderStep(current);
});
