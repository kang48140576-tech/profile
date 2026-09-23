/**
 * CARD NEWS SLIDER CONTROLLER (js/slider.js)
 * 3.2 고래잇 프로젝트 6단 카드뉴스 전용 인터랙티브 슬라이더 로직
 */

class CardNewsSlider {
  constructor(options = {}) {
    this.container = document.querySelector(options.containerSelector || '#cardNewsSlider');
    if (!this.container) return;

    this.images = options.images || [];
    this.captions = options.captions || [];
    this.currentIndex = 0;
    this.total = this.images.length;

    // DOM Elements
    this.track = this.container.querySelector('.slider-track');
    this.counterEl = this.container.querySelector('.slider-badge-counter');
    this.captionEl = this.container.querySelector('.slider-caption-text');
    this.dotsContainer = this.container.querySelector('.slider-dots');
    this.btnPrev = this.container.querySelector('.slider-arrow.prev');
    this.btnNext = this.container.querySelector('.slider-arrow.next');

    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    if (!this.track || this.total === 0) return;

    // 1. 슬라이드 트랙 생성
    this.track.innerHTML = '';
    this.images.forEach((src, idx) => {
      const slide = document.createElement('div');
      slide.className = 'slider-slide';
      slide.innerHTML = `<img src="${src}" alt="카드뉴스 ${idx + 1}단" class="slider-img" loading="lazy" />`;
      this.track.appendChild(slide);
    });

    // 2. 인디케이터 도트 생성
    if (this.dotsContainer) {
      this.dotsContainer.innerHTML = '';
      for (let i = 0; i < this.total; i++) {
        const dot = document.createElement('button');
        dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `${i + 1}번 슬라이드로 이동`);
        dot.addEventListener('click', () => this.goTo(i));
        this.dotsContainer.appendChild(dot);
      }
    }

    // 3. 버튼 이벤트 바인딩
    if (this.btnPrev) {
      this.btnPrev.addEventListener('click', () => this.prev());
    }
    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => this.next());
    }

    // 4. 모바일 터치 스와이프 이벤트
    this.track.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.track.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });

    // 5. 키보드 방향키 조작 (슬라이더 영역 호버/포커스 시)
    this.container.setAttribute('tabindex', '0');
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
      }
    });

    // 초기 상태 렌더링
    this.updateUI();
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        this.next(); // 왼쪽으로 스와이프 -> 다음 장
      } else {
        this.prev(); // 오른쪽으로 스와이프 -> 이전 장
      }
    }
  }

  goTo(index) {
    if (index < 0) {
      this.currentIndex = this.total - 1;
    } else if (index >= this.total) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = index;
    }
    this.updateUI();
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  updateUI() {
    // 1. 트랙 이동
    const offset = -(this.currentIndex * 100);
    this.track.style.transform = `translateX(${offset}%)`;

    // 2. 카운터 업데이트
    if (this.counterEl) {
      this.counterEl.innerText = `${this.currentIndex + 1} / ${this.total}`;
    }

    // 3. 캡션 텍스트 업데이트
    if (this.captionEl) {
      this.captionEl.innerText = this.captions[this.currentIndex] || `카드뉴스 ${this.currentIndex + 1} / ${this.total}`;
    }

    // 4. 도트 상태 업데이트
    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === this.currentIndex);
      });
    }
  }
}

// 전역 인스턴스 초기화 헬퍼 함수
window.initCardSlider = function(images, captions) {
  return new CardNewsSlider({
    containerSelector: '#cardNewsSlider',
    images: images,
    captions: captions
  });
};
