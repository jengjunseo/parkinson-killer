# 파킨슨 킬러 (Parkinson Killer)

액티브 상호작용 일정 관리 앱 - 파킨슨의 법칙을 이겨내는 생산성 도구

## 앱 소개

파킨슨 킬러는 "업무는 그것을 완수하는 데 할당된 시간만큼 늘어난다"는 파킨슨의 법칙을 극복하기 위해 설계된 타임박싱 앱입니다. 시간의 노예가 되지 않고, 집중력을 극대화하여 일정을 효율적으로 관리할 수 있습니다.

## 핵심 기능

- **타임박싱**: 정해진 시간 안에 목표를 완료하는 집중 기술
- **능동형 일정 관리**: 마감을 앞당겨 실제 중요한 것에 집중
- **서브태스크 관리**: 큰 작업을 잘게 나누어 마이크로 데드라인 설정
- **실패/지연 피드백**: 실패 시 스스로에게 각인시키는 강력한 동기부여
- **파킨슨 법칙 기반 교육**: 시간 관리의 원리를 체계적으로 학습
- **알림 및 AsyncStorage**: 백그라운드에서도 타이머 상태 유지

## 실행 방법

**중요:** 이 프로젝트는 단일 Expo 프로젝트로 구조화되었습니다. 더 이상 my-app 폴더를 사용하지 않습니다. 개발은 parkinson-killer 루트에서만 진행하세요.

1. 의존성 설치

   ```bash
   npm install
   ```

2. 코드 품질 검증

   ```bash
   npm run lint
   npx tsc --noEmit
   ```

3. 앱 시작

   ```bash
   npx expo start
   ```

4. 실행 옵션
   - `w` - 웹 브라우저에서 열기 (http://localhost:8081)
   - `a` - Android 에뮬레이터에서 열기
   - `i` - iOS 시뮬레이터에서 열기
   - Expo Go 앱으로 QR 코드 스캔

## 주요 폴더 구조

```
parkinson-killer/
├── app/                    # Expo Router 파일 기반 라우팅
│   ├── _layout.tsx        # 루트 레이아웃
│   ├── (tabs)/             # 탭 네비게이션
│   │   ├── _layout.tsx
│   │   ├── index.tsx       # 타임박싱 메인 화면
│   │   └── explore.tsx     # 파킨슨 교육 화면
│   └── modal.tsx           # 모달 라우트
├── components/             # 재사용 UI 컴포넌트
│   ├── ui/                 # 기본 UI 컴포넌트
│   └── themed-*            # 테마 적용 컴포넌트
├── src/
│   ├── features/           # 기능별 모듈
│   │   ├── timer/          # 타이머/타임박싱 기능
│   │   ├── education/      # 교육 콘텐츠
│   │   ├── schedule/       # 일정 관리
│   │   └── tasks/          # 할 일 관리
│   ├── services/           # 비즈니스 로직
│   │   ├── timer/          # 타이머 서비스
│   │   ├── storage/        # 데이터 저장소
│   │   └── notification/   # 알림 서비스
│   ├── types/              # TypeScript 타입 정의
│   └── utils/              # 유틸리티 함수
├── constants/              # 상수 및 테마
├── hooks/                  # 재사용 React 훅
└── assets/                 # 이미지 및 리소스
```

## 개발 규칙

- **파일 기반 라우팅**: Expo Router를 사용하여 파일 구조가 곧 라우팅 구조
- **타입스크립트**: 모든 컴포넌트와 함수는 TypeScript로 작성
- **기능 분리**: 비즈니스 로직은 `src/services/`, UI는 `components/`
- **테마 지원**: 라이트/다크 모드 지원
- **접근성**: Expo 접근성 가이드라인 준수

## 기술 스택

- **프레임워크**: Expo SDK 54, React Native 0.81.5
- **라우팅**: Expo Router 6.0
- **언어**: TypeScript
- **상태 관리**: React Hooks
- **스토리지**: AsyncStorage
- **알림**: Expo Notifications
- **애니메이션**: React Native Reanimated

## 파킨슨의 법칙이란?

> "업무는 그것을 완수하는 데 할당된 시간만큼 늘어난다." - 노스코트 파킨슨

이 앱은 시간이 많을 때 오히려 일이 늘어나는 현상을 극복하고, 시간을 효과적으로 제어하여 생산성을 극대화하는 데 도움을 줍니다.

---

**시간의 주인이 되어 당신의 목표를 정복하세요!** ⚡
