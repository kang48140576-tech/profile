/**
 * MAIN APP CONTROLLER (js/app.js)
 * 신세계 2기 포트폴리오 웹 애플리케이션 메인 제어 로직
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 3.1 더전골 탭 전환 바인딩
  initTheJeongolTabs();

  // 2. 3.2 고래잇 프로젝트 에셋 및 슬라이더 초기화
  initFeaturedShowcase();

  // 3. 딜리버러블 탭 전환 바인딩
  initDeliverableTabs();

  // 4. 전체 프로젝트 그리드 렌더링 및 필터링 바인딩
  initProjectsGrid();

  // 5. 네비게이션 스크롤 및 액티브 링크 바인딩
  initNavigation();

  // 6. 클립보드 복사 및 토스트 알림 바인딩
  initClipboardAndToast();

  // 7. KPI 카운터 애니메이션 감지
  initKpiCounters();
});

/**
 * 3.1 더전골 4대 탭(페르소나, 라인업, 프로모션, 기획서) 전환 제어
 */
function initTheJeongolTabs() {
  const tabButtons = document.querySelectorAll('.thejeongol-tab-btn');
  const tabPanels = document.querySelectorAll('.thejeongol-tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabPanels.forEach(panel => {
        if (panel.id === `thejeongolTab-${targetTab}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/**
 * 3.2 고래잇 프로젝트 인터랙티브 슬라이더 초기화
 */
function initFeaturedShowcase() {
  const project = PORTFOLIO_DATA.featuredProject;
  if (!project) return;

  // 카드뉴스 슬라이더 초기화 (js/slider.js 연동)
  if (typeof window.initCardSlider === 'function' && project.deliverables.cardNews) {
    window.initCardSlider(
      project.deliverables.cardNews.images,
      project.deliverables.cardNews.captions
    );
  }
}

/**
 * 딜리버러블 4대 탭(카드뉴스, 포스터, 숏폼, 로드맵) 전환 제어
 */
function initDeliverableTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      // 탭 버튼 활성화 상태 업데이트
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // 탭 패널 활성화 상태 업데이트
      tabPanels.forEach(panel => {
        if (panel.id === `tabPanel-${targetTab}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
          // 영상 탭이 아닐 경우 비디오 일시정지
          const video = panel.querySelector('video');
          if (video) video.pause();
        }
      });
    });
  });
}

/**
 * 전체 프로젝트 그리드 동적 렌더링 및 카테고리 필터링
 */
function initProjectsGrid() {
  const grid = document.getElementById('allProjectsGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!grid) return;

  // 렌더링 함수
  const renderProjects = (category = 'all') => {
    grid.innerHTML = '';
    const filtered = category === 'all'
      ? PORTFOLIO_DATA.allProjects
      : PORTFOLIO_DATA.allProjects.filter(p => p.category === category);

    filtered.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.dataset.id = project.id;

      card.innerHTML = `
        <div class="card-img-wrap">
          <img src="${project.thumbnail}" alt="${project.title}" class="card-img" loading="lazy" />
          <span class="badge ${project.featured ? 'badge-yellow' : 'badge-blue'} card-badge">
            ${project.categoryLabel}
          </span>
        </div>
        <div class="card-content">
          <h3 class="card-title">${project.title}</h3>
          <p class="card-summary">${project.summary}</p>
          <div class="card-tags">
            ${project.tags.map(tag => `<span class="card-tag">#${tag}</span>`).join('')}
          </div>
        </div>
      `;

      // 카드 클릭 시 인터랙션
      card.addEventListener('click', () => {
        if (project.id === '8282-thejeongol') {
          // 3.1 더전골 프로젝트 섹션으로 부드럽게 스크롤
          const thejeongolSection = document.getElementById('thejeongolProject');
          if (thejeongolSection) {
            thejeongolSection.scrollIntoView({ behavior: 'smooth' });
            showToast('3.1 더전골 밀키트 상품 기획 쇼케이스로 이동했습니다.');
          }
        } else if (project.id === 'greateat-emart') {
          // 3.2 고래잇 프로젝트 메인 쇼케이스 섹션으로 부드럽게 스크롤
          const featuredSection = document.getElementById('featuredProject');
          if (featuredSection) {
            featuredSection.scrollIntoView({ behavior: 'smooth' });
            showToast('3.2 고래잇 X 이마트 인터랙티브 쇼케이스로 이동했습니다.');
          }
        } else if (project.id === 'bmap-gis') {
          // 지도 프로젝트 모달 팝업
          showProjectModal(project.id);
        } else {
          showProjectModal(project.id);
        }
      });

      grid.appendChild(card);
    });
  };

  // 초기 렌더링 (전체)
  renderProjects('all');

  // 필터 버튼 클릭 이벤트
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.category);
    });
  });
}

/**
 * 프로젝트 모달 팝업 띄우기
 */
function showProjectModal(projectId) {
  if (projectId === 'bmap-gis') {
    const modalHtml = `
      <div style="padding: 20px 0;">
        <span class="badge badge-emerald" style="margin-bottom: 12px;">Web Development & GIS</span>
        <h2 style="font-size: 1.8rem; margin-bottom: 8px; color: #fff;">부산 주요 상권 지도 조회 시스템 (B-Map)</h2>
        <p style="color: var(--text-muted); margin-bottom: 24px; font-size: 1rem;">
          부산시 4대 주요 업종(대형마트, 백화점, 편의점, 체육시설) 공간 데이터 시각화 및 실시간 길찾기 대시보드
        </p>

        <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid var(--border-subtle);">
          <h4 style="color: var(--color-accent-yellow); margin-bottom: 8px;">핵심 기능 & 기술 스택</h4>
          <ul style="color: var(--text-main); font-size: 0.92rem; line-height: 1.7; padding-left: 20px;">
            <li><strong>Leaflet.js & MarkerCluster:</strong> 대용량 점포 마커 클러스터링 및 커스텀 핀 렌더링</li>
            <li><strong>PapaParse CSV 파서:</strong> 클라이언트 브라우저 단에서 실시간 CSV 파싱 및 사용자 데이터 업로드</li>
            <li><strong>다중 필터링:</strong> 대분류, 19개 소분류, 구·군별 인터랙티브 필터링 및 키워드 검색</li>
            <li><strong>길찾기 연동:</strong> 네이버 지도 / 카카오맵 실시간 길찾기 딥링크 제공</li>
          </ul>
        </div>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="./지도/부산 주요 상권 지도 조회 시스템.html" target="_blank" class="btn btn-primary">
            🚀 로컬 프로토타입 열기
          </a>
          <a href="https://kang48140576-tech.github.io/bmap/" target="_blank" class="btn btn-secondary">
            🌐 GitHub Pages 배포 사이트 방문
          </a>
        </div>
      </div>
    `;
    window.modalController.open(modalHtml);
  } else if (projectId === '8282-thejeongol') {
    const modalHtml = `
      <div style="padding: 20px 0;">
        <span class="badge badge-blue" style="margin-bottom: 12px;">Product Planning & Retail F&B</span>
        <h2 style="font-size: 1.8rem; margin-bottom: 8px; color: #fff;">1인 가구 컵전골 밀키트 '더전골' 상품 기획</h2>
        <p style="color: var(--text-muted); margin-bottom: 24px; font-size: 1rem;">
          2030 혼술·야식족을 위한 600mL 벤티형 식당급 전골 3종 및 편의점·SSG PAY 연계 런칭 전략
        </p>

        <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid var(--border-subtle);">
          <h4 style="color: var(--color-accent-yellow); margin-bottom: 8px;">상품 기획 핵심 요약</h4>
          <ul style="color: var(--text-main); font-size: 0.92rem; line-height: 1.7; padding-left: 20px;">
            <li><strong>타깃 페르소나:</strong> 27세 1인 가구 IT 스타트업 마케터 김서연 (배달비 부담, 퇴근 후 제대로 된 한끼)</li>
            <li><strong>라인업:</strong> 곱창 더전골(9,900원), 만두 더전골(7,900원), 마라 더전골(8,900원)</li>
            <li><strong>간편 조리:</strong> 전자레인지 6~7분, 냄비/설거지 불필요 벤티컵형 용기, 곤약면으로 야식 부담 완화</li>
            <li><strong>프로모션:</strong> 편의점 소주 500원 할인 번들링 & SSG PAY 결제 시 차회 30% 재구매 쿠폰 연계</li>
          </ul>
        </div>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="./8282/6_8282_전골밀키드.pdf" target="_blank" class="btn btn-primary">
            📄 전골 밀키트 기획서 PDF 보기
          </a>
        </div>
      </div>
    `;
    window.modalController.open(modalHtml);
  }
}

/**
 * 네비게이션 스크롤 감지 및 액티브 상태 업데이트
 */
function initNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * 클립보드 복사 및 토스트 팝업 제어
 */
function initClipboardAndToast() {
  const copyBtns = document.querySelectorAll('[data-copy]');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.dataset.copy;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`${textToCopy} 이(가) 클립보드에 복사되었습니다!`);
      }).catch(() => {
        showToast('클립보드 복사에 실패했습니다.');
      });
    });
  });
}

/**
 * 전역 토스트 알림 표시
 */
function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span style="color: var(--color-accent-yellow);">⚡</span> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/**
 * KPI 카드 진입 시 숫자 강조 애니메이션
 */
function initKpiCounters() {
  const kpiCards = document.querySelectorAll('.kpi-card');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  kpiCards.forEach(card => {
    card.style.opacity = '0.7';
    card.style.transform = 'translateY(10px)';
    card.style.transition = 'all 0.4s ease-out';
    observer.observe(card);
  });
}
