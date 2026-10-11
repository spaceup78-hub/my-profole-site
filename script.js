// ===== 프로젝트 데이터 (여기만 수정하면 카드가 바뀝니다) =====
const projects = [
  {
    title: '프로젝트 A',
    description: '프로젝트에 대한 짧은 설명을 여기에 적어주세요.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    image: 'images/project-a.svg',
    link: '#'
  },
  {
    title: '프로젝트 B',
    description: '프로젝트에 대한 짧은 설명을 여기에 적어주세요.',
    tags: ['JavaScript', 'Tailwind CSS'],
    image: 'images/project-b.svg',
    link: '#'
  },
  {
    title: '프로젝트 C',
    description: '프로젝트에 대한 짧은 설명을 여기에 적어주세요.',
    tags: ['HTML', 'CSS'],
    image: 'images/project-c.svg',
    link: '#'
  }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== 프로젝트 카드 렌더링 =====
function renderProjects() {
  const grid = $('#project-grid');
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (p, i) => `
      <article class="reveal project-card">
        <img src="${p.image}" alt="${p.title} 샘플 이미지" loading="lazy" />
        <div class="flex flex-1 flex-col gap-4 p-6">
          <div class="flex items-center justify-between text-xs text-white/40">
            <span>0${i + 1}</span>
            <span>${p.tags.length} STACK</span>
          </div>
          <h3 class="font-display text-3xl font-extrabold uppercase">${p.title}</h3>
          <p class="font-sans text-sm leading-relaxed text-white/60">${p.description}</p>
          <ul class="mt-auto flex flex-wrap gap-2 pt-2">
            ${p.tags.map((t) => `<li class="tag">${t}</li>`).join('')}
          </ul>
          <a href="${p.link}" class="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/80 hover:text-emerald-400">
            View project <span aria-hidden="true">→</span>
          </a>
        </div>
      </article>`
    )
    .join('');
}

// ===== 히어로 점 물결 배경 =====
function setupWave() {
  const canvas = $('#wave');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLS = 110;
  const ROWS = 70;
  // 일부 점만 파랑 · 보라 · 녹색 포인트
  const accents = ['96, 165, 250', '167, 139, 250', '52, 211, 153'];

  let width = 0;
  let height = 0;
  let dpr = 1;
  let t = 0;
  let frame = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    const cx = width * 0.68;
    const cy = height * 0.42;
    const scale = Math.min(width, height) * 0.62;

    for (let r = 0; r < ROWS; r++) {
      const z = r / (ROWS - 1) * 2 - 1; // -1 ~ 1 (앞 → 뒤)
      for (let c = 0; c < COLS; c++) {
        const x = c / (COLS - 1) * 2 - 1; // -1 ~ 1 (좌 → 우)

        // 물결 높이
        const wave =
          Math.sin(x * 3.2 + t) * Math.cos(z * 2.6 - t * 0.7) * 0.22 +
          Math.sin((x * x + z * z) * 4 - t * 1.4) * 0.08;

        // 간단한 원근 투영
        const depth = 1 / (1.6 + z * 0.9);
        const px = cx + x * scale * depth * 1.35;
        const py = cy + (wave - z * 0.55) * scale * depth * 1.5;

        const alpha = Math.max(0.06, Math.min(0.85, depth * 0.55));
        const size = 0.6 + depth * 0.9;
        const isAccent = (r * COLS + c) % 97 === 0;

        ctx.fillStyle = isAccent
          ? `rgba(${accents[(r + c) % accents.length]}, ${Math.min(1, alpha + 0.2)})`
          : `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const loop = () => {
    t += 0.008;
    draw();
    frame = requestAnimationFrame(loop);
  };

  resize();
  if (reducedMotion) {
    draw();
  } else {
    loop();
  }

  window.addEventListener('resize', () => {
    resize();
    if (reducedMotion) draw();
  });
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame));
}

// ===== 모바일 메뉴 =====
function setupMobileMenu() {
  const button = $('#menu-toggle');
  const menu = $('#mobile-menu');
  if (!button || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle('hidden', !open);
    menu.classList.toggle('flex', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  };

  button.addEventListener('click', () => {
    setOpen(menu.classList.contains('hidden'));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
}

// ===== 헤더 스크롤 배경 =====
function setupHeaderScroll() {
  const header = $('#header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ===== 현재 섹션 메뉴 강조 =====
function setupActiveNav() {
  const links = $$('a.nav-link');
  const sections = [...new Set([...links].map((link) => link.getAttribute('href')))]
    .map((href) => document.querySelector(href))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', isCurrent);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

// ===== 스크롤 리빌 애니메이션 =====
function setupReveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
}

// ===== 이메일 복사 =====
function setupCopyEmail() {
  const button = $('#copy-email');
  const status = $('#copy-status');
  if (!button || !status) return;

  const email = '123@gmail.com';

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      status.textContent = '이메일이 복사되었습니다 ✔';
    } catch (e) {
      status.textContent = '복사에 실패했습니다. 직접 입력해 주세요.';
    }
    setTimeout(() => (status.textContent = ''), 2500);
  });
}

// ===== 연도 자동 표시 =====
function setYear() {
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
}

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  setupWave();
  setupMobileMenu();
  setupHeaderScroll();
  setupActiveNav();
  setupReveal();
  setupCopyEmail();
  setYear();
});
