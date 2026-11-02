(() => {
  const journal = document.querySelector('[data-journal]');
  if (!journal) return;
  const search = journal.querySelector('[data-journal-search]');
  const buttons = [...journal.querySelectorAll('[data-topic]')];
  const stories = [...journal.querySelectorAll('.featured-story, .story-card')].map(element => {
    const category = element.querySelector('.story-category').textContent.toLowerCase();
    const topic = category.includes('engineering') ? 'engineering' : category.includes('security') ? 'security' : 'perspectives';
    return { element, topic, text: element.textContent.toLowerCase() };
  });
  let topic = 'all';
  function render() {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    for (const story of stories) {
      const matches = (topic === 'all' || story.topic === topic) && story.text.includes(query);
      story.element.hidden = !matches;
      if (matches) count++;
    }
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.topic === topic)));
    journal.querySelector('[data-journal-count]').textContent = `${count} ${count === 1 ? 'story' : 'stories'}`;
    journal.querySelector('[data-journal-empty]').hidden = count !== 0;
    journal.querySelector('.more-header').hidden = topic !== 'all' || query !== '';
    journal.querySelector('.story-grid').hidden = !stories.some(story => story.element.matches('.story-card') && !story.element.hidden);
  }
  buttons.forEach(button => button.addEventListener('click', () => { topic = button.dataset.topic; render(); }));
  search.addEventListener('input', render);
  journal.querySelector('[data-journal-reset]').addEventListener('click', () => {
    topic = 'all'; search.value = ''; render(); search.focus();
  });
  journal.querySelector('[data-journal-tools]').hidden = false;
})();
