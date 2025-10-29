// 언어 설정 (기본값: 한국어)
let currentLanguage = 'ko';

// DOM 요소 가져오기
const introPage = document.getElementById('intro-page');
const mainPage = document.getElementById('main-page');
const enterBtn = document.getElementById('enter-btn');
const languageSwitch = document.getElementById('language-switch');
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookiesBtn = document.getElementById('accept-cookies');
const declineCookiesBtn = document.getElementById('decline-cookies');
const logoHome = document.getElementById('logo-home');

// 페이지 전환 관련 요소
const viewDetailsButtons = document.querySelectorAll('.view-details');
const backButtons = document.querySelectorAll('.back-btn');
const subpages = document.querySelectorAll('.subpage');

// 커스텀 커서
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

// 커스텀 커서 이동
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

// 호버 효과
const hoverElements = document.querySelectorAll('a, button, .program-card, .log-entry');
hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursorFollower.style.transform = 'scale(1.3)';
    });

    element.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// 인트로 페이지에서 메인 페이지로 전환
enterBtn.addEventListener('click', function() {
    introPage.classList.add('hidden');
    setTimeout(() => {
        introPage.style.display = 'none';
        mainPage.style.display = 'block';
        // 쿠키 배너 표시 (쿠키 동의가 없는 경우)
        if (!getCookie('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }
    }, 800);
});

// 로고 클릭 시 인트로 페이지로 이동
if (logoHome) {
    logoHome.addEventListener('click', function() {
        // 모든 서브 페이지 숨기기
        subpages.forEach(page => {
            page.classList.remove('active');
        });

        // 메인 페이지 숨기기
        mainPage.style.display = 'none';

        // 인트로 페이지 표시
        introPage.style.display = 'flex';
        introPage.classList.remove('hidden');
    });
}

// 언어 전환 기능
function switchLanguage() {
    currentLanguage = currentLanguage === 'ko' ? 'en' : 'ko';
    updateLanguage();

    // 모든 언어 스위치 버튼 업데이트
    document.querySelectorAll('.language-switch').forEach(btn => {
        btn.textContent = currentLanguage === 'ko' ? 'EN' : 'KO';
    });
}

// 모든 언어 스위치 버튼에 이벤트 리스너 추가
document.querySelectorAll('.language-switch').forEach(button => {
    button.addEventListener('click', function() {
        switchLanguage();

        // 언어 전환 효과
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 300);
    });
});

// 언어 업데이트 함수
function updateLanguage() {
    const elements = document.querySelectorAll('[data-ko]');
    elements.forEach(element => {
        element.textContent = element.getAttribute(`data-${currentLanguage}`);
    });
}

// 서브 페이지로 전환
viewDetailsButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const projectCard = this.closest('.program-card');
        const projectId = projectCard.getAttribute('data-project');

        // 메인 페이지 숨기기
        mainPage.style.display = 'none';

        // 해당 프로젝트 서브 페이지 표시
        document.getElementById(`${projectId}-page`).classList.add('active');
    });
});

// 메인 페이지로 돌아가기
backButtons.forEach(button => {
    button.addEventListener('click', function() {
        // 모든 서브 페이지 숨기기
        subpages.forEach(page => {
            page.classList.remove('active');
        });

        // 메인 페이지 표시
        mainPage.style.display = 'block';
    });
});

// 다운로드 버튼 클릭 이벤트 (링크가 없는 버튼만 처리)
const downloadButtons = document.querySelectorAll('.project-download:not([href]), .download-btn:not([href])');
downloadButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();

        // 버튼 클릭 효과
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);

        alert(currentLanguage === 'ko' ? '다운로드가 시작됩니다.' : 'Download will start.');
        // 실제 다운로드 로직은 여기에 구현
    });
});

// 쿠키 관련 함수들
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) === 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

// 쿠키 동의 처리
acceptCookiesBtn.addEventListener('click', function() {
    setCookie('cookiesAccepted', 'true', 365);
    cookieBanner.classList.remove('show');
});

declineCookiesBtn.addEventListener('click', function() {
    setCookie('cookiesAccepted', 'false', 365);
    cookieBanner.classList.remove('show');
});

// 페이지 로드 시 쿠키 상태 확인
window.addEventListener('load', function() {
    if (getCookie('cookiesAccepted')) {
        // 쿠키가 이미 설정된 경우 배너를 표시하지 않음
        cookieBanner.style.display = 'none';
    }
});

// 부드러운 앵커 스크롤
(function() {
    const header = document.querySelector('header');
    function getHeaderHeight() {
        return header ? header.offsetHeight : 0;
    }

    // 스무스 스크롤(헤더 오프셋 적용)
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            if (!target || target === '#') return; // 기존 동작 유지
            const el = document.querySelector(target);
            if (el) {
                e.preventDefault();
                // 서브페이지가 열려있다면 닫고 메인 보여주기
                document.querySelectorAll('.subpage.active').forEach(sp => sp.classList.remove('active'));
                if (document.getElementById('main-page').style.display === 'none') {
                    document.getElementById('main-page').style.display = 'block';
                }

                const headerHeight = getHeaderHeight();
                const extraOffset = 12; // 헤더와 섹션 사이 여유
                const targetY = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraOffset;

                window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
            }
        });
    });
})();

