const studyPageBtn = document.getElementById('studyPageBtn');
const managePageBtn = document.getElementById('managePageBtn');
const studyPage = document.getElementById('studyPage');
const managePage = document.getElementById('managePage');
const vocabCard = document.getElementById('vocabCard');
const wordDisplay = document.getElementById('wordDisplay');
const translationDisplay = document.getElementById('translationDisplay');
const posDisplay = document.getElementById('posDisplay');
const exampleDisplay = document.getElementById('exampleDisplay');
const rootDisplay = document.getElementById('rootDisplay');
const prevCardBtn = document.getElementById('prevCardBtn');
const nextCardBtn = document.getElementById('nextCardBtn');
const cardCounter = document.getElementById('cardCounter');
const wordForm = document.getElementById('wordForm');
const englishInput = document.getElementById('englishInput');
const translationInput = document.getElementById('translationInput');
const posInput = document.getElementById('posInput');
const exampleInput = document.getElementById('exampleInput');
const rootInput = document.getElementById('rootInput');
const autoFillBtn = document.getElementById('autoFillBtn');
const wordList = document.getElementById('wordList');

let cards = [];
let activeIndex = 0;

const rootDatabase = {
  bio: '生命、自然 (bio-) e.g. biology, biography',
  port: '攜帶、送 (port-) e.g. transport, portable',
  dict: '說、詞語 (dict-) e.g. dictionary, predict',
  tele: '遠 (tele-) e.g. telephone, teleport',
  micro: '小 (micro-) e.g. microscope, microwave',
  auto: '自動 (auto-) e.g. automatic, autobiography',
  graph: '寫、畫 (graph-) e.g. autograph, graphic',
  spect: '看 (spect-) e.g. inspect, spectacle',
  struct: '建造、結構 (struct-) e.g. construct, structure',
  mit: '送 (mit-) e.g. transmit, permit',
};

function loadCards() {
  const stored = localStorage.getItem('vocabCards');
  cards = stored ? JSON.parse(stored) : [];
  if (!Array.isArray(cards)) cards = [];
}

function saveCards() {
  localStorage.setItem('vocabCards', JSON.stringify(cards));
}

function renderStudy() {
  if (!cards.length) {
    wordDisplay.textContent = '請新增單字';
    translationDisplay.textContent = '-';
    posDisplay.textContent = '-';
    exampleDisplay.textContent = '-';
    rootDisplay.textContent = '-';
    cardCounter.textContent = '0 / 0';
    return;
  }
  const card = cards[activeIndex];
  wordDisplay.textContent = card.english;
  translationDisplay.textContent = card.translation || '尚未填寫';
  posDisplay.textContent = card.pos || '尚未填寫';
  exampleDisplay.textContent = card.example || '尚未填寫';
  rootDisplay.textContent = card.root || '尚未填寫';
  cardCounter.textContent = `${activeIndex + 1} / ${cards.length}`;
}

function renderList() {
  wordList.innerHTML = '';
  if (!cards.length) {
    wordList.innerHTML = '<li class="word-item"><div>目前尚無單字，請新增。</div></li>';
    return;
  }

  cards.forEach((card, index) => {
    const item = document.createElement('li');
    item.className = 'word-item';
    item.innerHTML = `
      <div>
        <strong>${card.english}</strong>
        <div class="word-meta">${card.translation || '-'} · ${card.pos || '-'} · ${card.example || '-'}</div>
      </div>
      <button class="delete-btn" data-index="${index}">刪除</button>
    `;
    wordList.appendChild(item);
  });
}

function switchPage(page) {
  if (page === 'study') {
    studyPage.classList.add('active');
    managePage.classList.remove('active');
    studyPageBtn.classList.add('active');
    managePageBtn.classList.remove('active');
  } else {
    studyPage.classList.remove('active');
    managePage.classList.add('active');
    studyPageBtn.classList.remove('active');
    managePageBtn.classList.add('active');
  }
}

function createRootAnalysis(word) {
  const lower = word.toLowerCase();
  const matches = Object.entries(rootDatabase).filter(([key]) => lower.includes(key));
  if (matches.length) {
    return matches.map(([key, value]) => `${key}: ${value}`).join('； ');
  }
  return '字根分析暫無資料，可手動補充。';
}

async function autoFill() {
  const word = englishInput.value.trim();
  if (!word) {
    alert('請先輸入英文單字。');
    return;
  }

  autoFillBtn.textContent = '查詢中...';
  autoFillBtn.disabled = true;

  try {
    const [translate, dictionary] = await Promise.all([
      fetchTranslation(word),
      fetchDictionaryData(word),
    ]);

    translationInput.value = translate || translationInput.value;
    posInput.value = dictionary.pos || posInput.value;
    exampleInput.value = dictionary.example || exampleInput.value;
    rootInput.value = dictionary.root || rootInput.value || createRootAnalysis(word);
  } catch (error) {
    console.error(error);
    alert('自動填入失敗，請稍後再試。');
  } finally {
    autoFillBtn.textContent = '自動填入';
    autoFillBtn.disabled = false;
  }
}

async function fetchTranslation(word) {
  try {
    const resp = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|zh-TW`);
    if (!resp.ok) return '';
    const data = await resp.json();
    const translated = data.responseData?.translatedText;
    if (translated && translated !== word) {
      return translated;
    }
  } catch (error) {
    console.warn('translation api error', error);
  }
  return '';
}

async function fetchDictionaryData(word) {
  try {
    const resp = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (!resp.ok) return {};
    const data = await resp.json();
    if (!Array.isArray(data) || !data.length) return {};
    const entry = data[0];
    const meaning = entry.meanings?.[0];
    const definition = meaning?.definitions?.[0];
    return {
      pos: meaning?.partOfSpeech || '',
      example: definition?.example || entry.word || '',
      root: createRootAnalysis(word),
    };
  } catch (error) {
    console.warn('dictionary api error', error);
    return {};
  }
}

function addWord(event) {
  event.preventDefault();
  const english = englishInput.value.trim();
  if (!english) {
    alert('英文單字為必填。');
    return;
  }

  const newCard = {
    english,
    translation: translationInput.value.trim(),
    pos: posInput.value.trim(),
    example: exampleInput.value.trim(),
    root: rootInput.value.trim(),
  };

  cards.push(newCard);
  saveCards();
  renderList();
  activeIndex = cards.length - 1;
  renderStudy();
  wordForm.reset();
  alert('已新增單字到管理清單。');
}

function handleDelete(event) {
  const index = Number(event.target.dataset.index);
  if (Number.isNaN(index)) return;
  if (!confirm('確定要刪除此單字？')) return;
  cards.splice(index, 1);
  if (activeIndex >= cards.length) {
    activeIndex = Math.max(0, cards.length - 1);
  }
  saveCards();
  renderList();
  renderStudy();
}

function showNextCard() {
  if (cards.length === 0) return;
  activeIndex = (activeIndex + 1) % cards.length;
  renderStudy();
  vocabCard.classList.remove('flipped');
}

function showPrevCard() {
  if (cards.length === 0) return;
  activeIndex = (activeIndex - 1 + cards.length) % cards.length;
  renderStudy();
  vocabCard.classList.remove('flipped');
}

function initEvents() {
  studyPageBtn.addEventListener('click', () => switchPage('study'));
  managePageBtn.addEventListener('click', () => switchPage('manage'));
  vocabCard.addEventListener('click', () => vocabCard.classList.toggle('flipped'));
  prevCardBtn.addEventListener('click', showPrevCard);
  nextCardBtn.addEventListener('click', showNextCard);
  autoFillBtn.addEventListener('click', autoFill);
  wordForm.addEventListener('submit', addWord);
  wordList.addEventListener('click', handleDelete);
}

function init() {
  loadCards();
  renderStudy();
  renderList();
  initEvents();
}

init();
