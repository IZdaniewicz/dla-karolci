const flowerButton = document.querySelector('#flowerButton');
const scrollHint = document.querySelector('#scrollHint');
const petalLayer = document.querySelector('#petalLayer');
const hiddenSections = [...document.querySelectorAll('.hidden-section')];
const revealElements = [...document.querySelectorAll('.reveal-on-scroll')];

const heartTap = document.querySelector('#heartTap');
const heartSymbol = document.querySelector('#heartSymbol');
const heartTapLabel = document.querySelector('#heartTapLabel');
const loveProgress = document.querySelector('#loveProgress');
const tapMessage = document.querySelector('#tapMessage');

const loveButton = document.querySelector('#loveButton');
const kissPhoto = document.querySelector('#kissPhoto');
const kissPhotoWrap = document.querySelector('#kissPhotoWrap');
const restartLink = document.querySelector('#restartLink');

let storyStarted = false;
let loveLevel = 0;
let kissShown = false;

const loveMessages = [
  '0% miłości… to zdecydowanie za mało.',
  '20% — o, już zaczyna bić szybciej 💗',
  '40% — chyba myśli o Karolci…',
  '60% — robi się naprawdę cieplutko 🥺',
  '80% — jeszcze tylko odrobinkę!',
  '100% — przepełnione miłością do Ciebie ♡'
];

function unlockStory() {
  if (storyStarted) return;

  storyStarted = true;
  flowerButton.classList.add('bloomed');
  flowerButton.querySelector('.flower-label').textContent = 'dla Ciebie ♡';
  scrollHint.classList.add('visible');
  hiddenSections.forEach(section => section.classList.add('unlocked'));

  petalShower(22);
  setTimeout(() => {
    document.querySelector('#story').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 760);
}

function petalShower(amount = 16) {
  for (let index = 0; index < amount; index += 1) {
    setTimeout(() => {
      const petal = document.createElement('span');
      petal.className = 'falling-petal';
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.setProperty('--fall-time', `${4 + Math.random() * 3}s`);
      petal.style.setProperty('--drift-x', `${-90 + Math.random() * 180}px`);
      petal.style.setProperty('--spin', `${300 + Math.random() * 650}deg`);
      petalLayer.appendChild(petal);

      setTimeout(() => petal.remove(), 7600);
    }, index * 80);
  }
}

function floatHeartFrom(element, symbol = '♡') {
  const rect = element.getBoundingClientRect();
  const floating = document.createElement('span');
  floating.className = 'floating-love';
  floating.textContent = symbol;
  floating.style.left = `${rect.left + rect.width * (0.3 + Math.random() * 0.4)}px`;
  floating.style.top = `${rect.top + rect.height * (0.25 + Math.random() * 0.45)}px`;
  document.body.appendChild(floating);
  setTimeout(() => floating.remove(), 1400);
}

function fillHeart() {
  if (loveLevel < 5) {
    loveLevel += 1;
  }

  const percentage = loveLevel * 20;
  const scale = 0.72 + loveLevel * 0.065;

  loveProgress.style.width = `${percentage}%`;
  heartSymbol.style.setProperty('--heart-scale', scale.toFixed(2));
  heartSymbol.classList.remove('bump');
  void heartSymbol.offsetWidth;
  heartSymbol.classList.add('bump');
  tapMessage.textContent = loveMessages[loveLevel];

  floatHeartFrom(heartTap, ['♡', '♥', '💗'][loveLevel % 3]);

  if (loveLevel === 5) {
    heartTapLabel.textContent = 'pełne miłości ♡';
    petalShower(12);
  } else {
    heartTapLabel.textContent = 'jeszcze trochę';
  }
}

function showKiss() {
  if (!kissShown) {
    kissShown = true;
    const photoSource = kissPhoto.dataset.src;
    if (photoSource) {
      kissPhoto.src = photoSource;
    }
    kissPhotoWrap.classList.add('visible');
    loveButton.textContent = 'Buziak dla Ciebie 😘';
  }

  petalShower(14);
  for (let index = 0; index < 6; index += 1) {
    setTimeout(() => floatHeartFrom(loveButton, ['♡', '♥', '💗'][index % 3]), index * 75);
  }

  setTimeout(() => {
    kissPhotoWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 280);
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('revealed');
    observer.unobserve(entry.target);
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -24px 0px'
});

revealElements.forEach(element => revealObserver.observe(element));

flowerButton.addEventListener('click', unlockStory);
heartTap.addEventListener('click', fillHeart);
loveButton.addEventListener('click', showKiss);

restartLink.addEventListener('click', () => {
  petalShower(8);
  setTimeout(() => flowerButton.focus({ preventScroll: true }), 450);
});
