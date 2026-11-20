const status = document.querySelector('#status');
const stages = [...document.querySelectorAll('[data-step]')];
const trace = document.querySelector('.trace');
const messages = [
  'The application receives the sample question.',
  'Hybrid search retrieves matching passages from documents available to the sample tenant.',
  'A reranker scores the candidate passages and keeps the most relevant evidence.',
  'Example answer: You have 30 days to return an order. Source: sample returns policy.'
];

function showStage(index) {
  trace.dataset.active = index;
  stages.forEach((button, step) => {
    if (step === index) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  status.textContent = messages[index];
}

stages.forEach((button, index) => {
  button.addEventListener('click', () => showStage(index));
});

showStage(0);
