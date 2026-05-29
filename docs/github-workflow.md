# Parkinson Killer GitHub Workflow

이 문서는 Parkinson Killer를 압축 파일로 주고받지 않고 GitHub 중심으로 관리하기 위한 최소 운영 규칙입니다.

## 오늘의 목표

현재 실행 가능한 MVP 상태를 GitHub private repository에 올리고 첫 세이브포인트를 만듭니다.

권장 첫 커밋 메시지:

```text
Initial MVP backup
```

## 핵심 개념

| 개념 | 프로젝트에서의 의미 |
| --- | --- |
| commit | 잘 되는 순간을 저장하는 세이브포인트 |
| branch | 새 기능을 실험하는 평행 작업 공간 |
| merge | 실험이 성공했을 때 안정 버전에 합치기 |
| push | GitHub 서버에 업로드 |
| pull | GitHub 서버의 최신판 가져오기 |
| clone | 새 컴퓨터나 새 작업환경에 복사 |
| revert | 망친 변경을 기록으로 남기고 되돌리기 |

## 브랜치 전략

복잡한 Git Flow는 쓰지 않습니다.

```text
main
```

항상 실행 가능한 안정 버전입니다.

```text
feature/*
```

새 기능 실험용 브랜치입니다.

예시:

```text
feature/progress-bar
feature/session-history
feature/custom-bottom-ui
```

```text
fix/*
```

버그 수정용 브랜치입니다.

예시:

```text
fix/timer-restore-bug
```

```text
native/*
```

Expo에서 Android Native로 갈아타는 실험용 브랜치입니다.

예시:

```text
native/android-compose-prototype
```

## 작업 루틴

1. 작업 전, 현재 잘 되는 상태를 커밋합니다.
2. 새 기능은 `feature/*` 브랜치에서 작업합니다.
3. 버그 수정은 `fix/*` 브랜치에서 작업합니다.
4. `main`에는 검증된 변경만 합칩니다.
5. 기능이 망가지면 실험 브랜치를 버리고 `main`으로 돌아갑니다.

## AI 에이전트에게 시킬 때 기본 문장

```text
현재 main 브랜치는 안정 버전이다.
새 기능은 feature/브랜치명 브랜치를 만들어서 작업해라.
기존 타이머 로직, AsyncStorage, Notifications는 위험 영역이므로 최소 수정해라.
변경 후 타입 체크와 실행 검증을 해라.
작업이 끝나면 변경 요약과 추천 커밋 메시지를 알려줘.
```

## Parkinson Killer 보호 규칙

- `main`은 항상 실행 가능한 상태로 유지합니다.
- 큰 실험은 반드시 브랜치에서 진행합니다.
- `node_modules/`, `.expo/`, `dist/`, `build/`, `.env`는 GitHub에 올리지 않습니다.
- React Native 스타일은 `StyleSheet.create()`를 유지합니다.
- 새 버튼은 기본적으로 `components/ui/AppButton.tsx`를 사용합니다.
- 디자인 토큰은 `constants/theme.ts`의 `Theme`를 우선 사용합니다.
- `components/haptic-tab.tsx`는 특별한 이유 없이는 수정하지 않습니다.
- 타이머, AsyncStorage, Notifications 변경은 작게 나누고 검증합니다.

## GitHub Desktop 기준 첫 업로드

1. GitHub Desktop을 엽니다.
2. `File -> Add local repository`를 누릅니다.
3. 아래 폴더를 선택합니다.

```text
C:\Users\user\Downloads\parkinson-killer(1)\parkinson-killer
```

4. 저장소가 아니라는 안내가 나오면 `create a repository`를 선택합니다.
5. Repository name은 `parkinson-killer`로 둡니다.
6. 첫 커밋 메시지를 `Initial MVP backup`으로 입력합니다.
7. `Commit to main`을 누릅니다.
8. `Publish repository`를 누릅니다.
9. 처음에는 `Private`로 올립니다.

## 추천 커밋 메시지 예시

```text
Initial MVP backup
Working MVP before timer improvements
Add timer progress indicator
Add session history storage
Fix timer restore state
Polish timeboxing form layout
```

