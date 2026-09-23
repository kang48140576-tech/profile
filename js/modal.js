/**
 * MODAL CONTROLLER (js/modal.js)
 * 프로젝트 상세 및 미디어 풀스크린 모달 제어 로직
 */

class ModalController {
  constructor() {
    this.overlay = document.getElementById('projectModal');
    this.modalContent = document.getElementById('modalBody');
    this.closeBtn = document.getElementById('modalCloseBtn');
    this.isOpen = false;

    this.bindEvents();
  }

  bindEvents() {
    if (!this.overlay) return;

    // 1. 닫기 버튼 클릭
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // 2. 오버레이 백드롭 클릭
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // 3. ESC 키보드 입력
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open(htmlContent) {
    if (!this.overlay || !this.modalContent) return;

    this.modalContent.innerHTML = htmlContent;
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.isOpen = true;
  }

  close() {
    if (!this.overlay) return;

    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
    this.isOpen = false;

    // 모달 내 동영상 정지 처리
    if (this.modalContent) {
      const videos = this.modalContent.querySelectorAll('video');
      videos.forEach(v => v.pause());
    }
  }
}

// 전역 모달 인스턴스
window.modalController = new ModalController();
