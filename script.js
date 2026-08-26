const flowerButton = document.querySelector('#flowerButton');
const scrollHint = document.querySelector('#scrollHint');
const petalLayer = document.querySelector('#petalLayer');
const hiddenSections = [...document.querySelectorAll('.hidden-section')];
const revealElements = [...document.querySelectorAll('.reveal-on-scroll')];

const reasonButton = document.querySelector('#reasonButton');
const reasonText = document.querySelector('#reasonText');

const gameButton = document.querySelector('#gameButton');
const gameArea = document.querySelector('#gameArea');
const scoreElement = document.querySelector('#score');
const gameMessage = document.querySelector('#gameMessage');

const loveButton = document.querySelector('#loveButton');
const loveAnswer = document.querySelector('#loveAnswer');
const restartLink = document.querySelector('#restartLink');

let storyStarted = false;
let score = 0;
let gameRunning = false;
let heartTimer = null;
let currentReason = 0;
let loveClicks = 0;

const reasons = [
  'Za Twój uśmiech, który potrafi mi naprawić dzień.',
  'Za to, że przy Tobie zwykły dzień potrafi być moim ulubionym.',
  'Za Twoje małe miny, które pewnie znasz gorzej ode mnie.',
  'Za to, jak bardzo potrafisz być czuła.',
  'Za Twój charakter — także wtedy, kiedy stawia mnie do pionu.',
  'Za to, że mogę z Tobą być kompletnie sobą.',
  'Za wszystkie nasze głupie żarty, które śmieszą tylko nas.',
  'Za to, że tęsknię za Tobą szybciej, niż wypada się przyznać.',
  'Za Twoją obecność. Czasem naprawdę tyle wystarczy.',
  'Za każdy moment, kiedy patrzę na Ciebie i myślę: ale mam szczęście.',
  'Za to, że jesteś właśnie Tobą. Tego nie da się zastąpić.',
  'Za milion drobiazgów, których nawet nie umiem wszystkich nazwać.'
];

function unlockStory() {
  if (storyStarted) return;

  storyStarted = true;
  flowerButton.classList.add('bloomed');
  flowerButton.querySelector('.flower-label').textContent = 'dla Ciebie ♡';
  scrollHint.classList.add('visible');
  hiddenSections.forEach(section => section.classList.add('unlocked'));

  petalShower(24);
  setTimeout(() => {
    document.querySelector('#story').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 850);
}

function petalShower(amount = 18) {
  for (let index = 0; index < amount; index += 1) {
    setTimeout(() => {
      const petal = document.createElement('span');
      petal.className = 'falling-petal';
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.setProperty('--fall-time', `${4.2 + Math.random() * 3.4}s`);
      petal.style.setProperty('--drift-x', `${-100 + Math.random() * 200}px`);
      petal.style.setProperty('--spin', `${300 + Math.random() * 700}deg`);
      petal.style.transform = `scale(${0.65 + Math.random() * 0.8})`;
      petalLayer.appendChild(petal);

      setTimeout(() => petal.remove(), 8000);
    }, index * 90);
  }
}

function showNextReason() {
  let nextReason = currentReason;

  while (nextReason === currentReason && reasons.length > 1) {
    nextReason = Math.floor(Math.random() * reasons.length);
  }

  currentReason = nextReason;
  reasonText.classList.remove('switching');
  void reasonText.offsetWidth;
  reasonText.classList.add('switching');

  setTimeout(() => {
    reasonText.textContent = reasons[currentReason];
  }, 180);
}

function randomHeartPosition() {
  const safePadding = 58;
  const maxX = Math.max(gameArea.clientWidth - safePadding, 20);
  const maxY = Math.max(gameArea.clientHeight - safePadding, 20);

  return {
    x: Math.max(4, Math.random() * maxX),
    y: Math.max(4, Math.random() * maxY)
  };
}

function spawnHeart() {
  if (!gameRunning || score >= 7) return;

  const heart = document.createElement('button');
  const symbols = ['💗', '💖', '💕', '💓', '💞'];
  const { x, y } = randomHeartPosition();

  heart.type = 'button';
  heart.className = 'catch-heart';
  heart.setAttribute('aria-label', 'Złap serduszko');
  heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.animationDelay = `${Math.random() * -1}s`;

  const escapeHeart = () => {
    if (!heart.isConnected || heart.classList.contains('caught')) return;
    const next = randomHeartPosition();
    heart.style.transition = 'left 450ms ease, top 450ms ease';
    heart.style.left = `${next.x}px`;
    heart.style.top = `${next.y}px`;
  };

  const escapeTimer = setInterval(escapeHeart, 1000 + Math.random() * 700);

  heart.addEventListener('click', () => {
    clearInterval(escapeTimer);
    heart.classList.add('caught');
    score += 1;
    scoreElement.textContent = score;
    createFloatingLove(heart);

    setTimeout(() => heart.remove(), 360);

    if (score >= 7) {
      finishGame();
    }
  }, { once: true });

  gameArea.appendChild(heart);

  setTimeout(() => {
    clearInterval(escapeTimer);
    if (heart.isConnected && !heart.classList.contains('caught')) {
      heart.remove();
    }
  }, 5200);
}

function startGame() {
  gameArea.querySelectorAll('.catch-heart').forEach(heart => heart.remove());
  clearInterval(heartTimer);

  score = 0;
  gameRunning = true;
  scoreElement.textContent = '0';
  gameMessage.textContent = 'No dobra… łap! 💕';
  gameButton.textContent = 'Gramy!';
  gameButton.disabled = true;

  spawnHeart();
  spawnHeart();
  heartTimer = setInterval(() => {
    if (gameArea.querySelectorAll('.catch-heart').length < 3) {
      spawnHeart();
    }
  }, 900);
}

function finishGame() {
  gameRunning = false;
  clearInterval(heartTimer);
  heartTimer = null;
  gameArea.querySelectorAll('.catch-heart').forEach(heart => {
    setTimeout(() => heart.remove(), 500);
  });

  gameMessage.textContent = 'Wygrałaś. Nagroda: wszystkie moje serduszka i jeden ogromny przytulas. 🫂♡';
  gameButton.textContent = 'Jeszcze raz?';
  gameButton.disabled = false;
  petalShower(10);
}

function createFloatingLove(sourceElement) {
  const rect = sourceElement.getBoundingClientRect();
  const floating = document.createElement('span');
  floating.className = 'floating-love';
  floating.textContent = '+1 ♡';
  floating.style.left = `${rect.left + rect.width / 2}px`;
  floating.style.top = `${rect.top + rect.height / 2}px`;
  document.body.appendChild(floating);
  setTimeout(() => floating.remove(), 1450);
}

function answerWithLove() {
  const answers = [
    'To uznaję za bardzo oficjalne „tak” 😌💗',
    'Jeszcze jeden? Ja nie będę protestował… 🥺',
    'Dobra, dobra. Już się rozpieszczam. Kocham Cię! ♡'
  ];

  loveAnswer.textContent = answers[Math.min(loveClicks, answers.length - 1)];
  loveClicks += 1;
  petalShower(12);

  const buttonRect = loveButton.getBoundingClientRect();
  for (let index = 0; index < 7; index += 1) {
    setTimeout(() => {
      const heart = document.createElement('span');
      heart.className = 'floating-love';
      heart.textContent = ['♡', '♥', '💗'][index % 3];
      heart.style.left = `${buttonRect.left + Math.random() * buttonRect.width}px`;
      heart.style.top = `${buttonRect.top + Math.random() * buttonRect.height}px`;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1450);
    }, index * 80);
  }
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('revealed');
    observer.unobserve(entry.target);
  });
}, {
  threshold: 0.14,
  rootMargin: '0px 0px -30px 0px'
});

revealElements.forEach(element => revealObserver.observe(element));

flowerButton.addEventListener('click', unlockStory);
reasonButton.addEventListener('click', showNextReason);
gameButton.addEventListener('click', startGame);
loveButton.addEventListener('click', answerWithLove);

restartLink.addEventListener('click', () => {
  petalShower(8);
  setTimeout(() => flowerButton.focus({ preventScroll: true }), 500);
});

window.addEventListener('resize', () => {
  if (!gameRunning) return;
  gameArea.querySelectorAll('.catch-heart').forEach(heart => {
    const { x, y } = randomHeartPosition();
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
  });
});
