
# AWESOME CHAT - 다크모드 채팅 웹사이트

보라색 그라데이션과 한컴 말랑말랑 폰트를 사용한 아름다운 다크모드 채팅 플랫폼입니다.

## 🚀 빠른 시작

### 1. package.json
프로젝트의 의존성과 스크립트를 관리하는 핵심 파일입니다.

**주요 의존성:**
- `@lumi.new/sdk`: 실시간 데이터베이스 연동
- `react`, `react-dom`: React 프레임워크
- `react-router-dom`: 페이지 라우팅
- `framer-motion`: 애니메이션 효과
- `react-hot-toast`: 알림 메시지
- `lucide-react`: 아이콘 라이브러리

**스크립트:**
```bash
npm run dev     # 개발 서버 실행
npm run build   # 프로덕션 빌드
npm run preview # 빌드 미리보기
```

### 2. index.html
메인 HTML 파일로 한컴 말랑말랑 폰트와 메타데이터를 설정합니다.

**특징:**
- 한글 언어 설정 (`lang="ko"`)
- 한컴 말랑말랑 폰트 CDN 로드
- 보라색 그라데이션 배경 설정
- 반응형 뷰포트 설정

### 3. App.tsx
React 애플리케이션의 메인 컴포넌트로 라우팅과 상태 관리를 담당합니다.

**주요 기능:**
- 사용자 닉네임 관리
- 페이지 라우팅 (Welcome → Nickname → Rooms → Chat)
- 로컬스토리지 기반 상태 유지
- 토스트 알림 시스템

## 📁 설치 방법

1. **프로젝트 폴더 생성**
```bash
mkdir awesome-chat-website
cd awesome-chat-website
```

2. **package.json 파일 생성**
- 제공된 package.json 내용을 복사하여 저장

3. **의존성 설치**
```bash
npm install
```

4. **index.html 파일 생성**
- 루트 폴더에 제공된 index.html 내용을 복사하여 저장

5. **src 폴더 및 App.tsx 생성**
```bash
mkdir src
```
- src 폴더에 제공된 App.tsx 내용을 복사하여 저장

6. **개발 서버 실행**
```bash
npm run dev
```

## 🎨 디자인 특징

- **다크모드**: 전체 다크 테마 적용
- **보라색 그라데이션**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **한컴 말랑말랑 폰트**: 부드럽고 친근한 한글 폰트
- **글래스모피즘**: 반투명 효과와 블러 처리
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

## 🔧 추가 설정 필요 파일

이 README는 3개 핵심 파일만을 다루고 있습니다. 완전한 동작을 위해서는 다음 파일들이 추가로 필요합니다:

- `src/main.tsx` - React 진입점
- `src/index.css` - 전역 스타일
- `src/pages/` - 각 페이지 컴포넌트들
- `src/entities/` - MongoDB 스키마 파일들
- `src/hooks/` - 커스텀 훅들
- `src/lib/lumi.ts` - Lumi SDK 설정
- 설정 파일들 (vite.config.ts, tailwind.config.js 등)

## 📱 주요 기능

- 실시간 채팅 메시지
- 공개/비공개 채팅방
- 닉네임 중복 검사
- 자동 스크롤 및 실시간 업데이트
- 반응형 UI/UX

## 🛠️ 기술 스택

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Animation**: Framer Motion
- **Database**: MongoDB (Lumi SDK)
- **Build Tool**: Vite
- **Font**: 한컴 말랑말랑 (CDN)

## 📞 지원

문제가 발생하거나 추가 파일이 필요한 경우 개발팀에 문의하세요.
이 파일들 중 3개만 선정하여 한 것입니다.
