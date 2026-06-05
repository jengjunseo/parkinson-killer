import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { AppButton } from '../../components/ui/AppButton';
import { Theme } from '../../constants/theme';
import { useTimer } from '../../src/hooks/useTimer';
import { cancelFailureNotification, scheduleFailureNotification } from '../../src/services/notificationService';
import { clearSavedSession, loadSavedSession, saveSession } from '../../src/services/sessionStorage';
import { SubTask } from '../../src/types/timeboxing';

const { width } = Dimensions.get('window');
const STEP_ANIMATION_DURATION = 220;

const WARM_QUOTES = [
  '작게 시작해도 괜찮아요. 지금 시작하는 쪽이 이깁니다.',
  '완벽한 하루보다 끝낸 한 시간이 더 강합니다.',
  '오늘은 시간을 늘리지 말고, 시간을 가둬봅시다.',
  '도망치고 싶은 마음까지 데리고 시작하면 됩니다.',
];

type StartStep = 0 | 1 | 2 | 3;

export default function TimeBoxingScreen() {
  const [hasStartedFlow, setHasStartedFlow] = useState(false);
  const [currentStep, setCurrentStep] = useState<StartStep>(0);
  const [taskName, setTaskName] = useState('');
  const [totalMinutes, setTotalMinutes] = useState('');
  const [failMessage, setFailMessage] = useState('');
  const [isBlackout, setIsBlackout] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  const stepAnim = useRef(new Animated.Value(width)).current;
  const stepOpacity = useRef(new Animated.Value(0)).current;
  const quoteIndex = useRef(Math.floor(Math.random() * WARM_QUOTES.length)).current;

  const handleEndComplete = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    await clearSavedSession();
    await cancelFailureNotification();
    setIsBlackout(true);
  };

  const {
    tasksQueue,
    currentTaskIndex,
    remainingTime,
    isActive,
    startTimer,
    stopTimer,
  } = useTimer(handleEndComplete);

  const checkExistingTimer = async () => {
    try {
      const savedSession = await loadSavedSession();

      if (!savedSession) {
        return;
      }

      if (savedSession.endTime <= Date.now()) {
        await clearSavedSession();
        return;
      }

      setTaskName(savedSession.task || '');
      setFailMessage(savedSession.failMsg || '');
    } catch {
      await clearSavedSession();
    }
  };

  useEffect(() => {
    checkExistingTimer();
  }, []);

  useEffect(() => {
    if (!hasStartedFlow) {
      return;
    }

    stepAnim.setValue(width);
    stepOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(stepAnim, {
        toValue: 0,
        duration: STEP_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(stepOpacity, {
        toValue: 1,
        duration: STEP_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep, hasStartedFlow, stepAnim, stepOpacity]);

  const getCalculatedMinutes = () => {
    const hours = Number(totalMinutes.replace(',', '.'));

    if (!Number.isFinite(hours) || hours <= 0) {
      return 0;
    }

    return Math.round(hours * 60);
  };

  const beginStartFlow = () => {
    setCurrentStep(0);
    setHasStartedFlow(true);
  };

  const goToNextStep = () => {
    if (currentStep === 0 && !taskName.trim()) {
      return;
    }

    if (currentStep === 1 && getCalculatedMinutes() <= 0) {
      return;
    }

    if (currentStep === 2 && !failMessage.trim()) {
      return;
    }

    Animated.parallel([
      Animated.timing(stepAnim, {
        toValue: -width,
        duration: STEP_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(stepOpacity, {
        toValue: 0,
        duration: STEP_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentStep((step) => Math.min(step + 1, 3) as StartStep);
    });
  };

  const startBoxing = async () => {
    const calculatedMinutes = getCalculatedMinutes();

    if (!taskName.trim() || calculatedMinutes <= 0 || !failMessage.trim()) {
      return;
    }

    Keyboard.dismiss();

    const totalSeconds = calculatedMinutes * 60;
    const queue: SubTask[] = [
      {
        id: 'main',
        name: taskName.trim(),
        durationSec: totalSeconds,
      },
    ];

    await saveSession({
      endTime: Date.now() + totalSeconds * 1000,
      total: totalSeconds,
      failMsg: failMessage.trim(),
      task: taskName.trim(),
    });
    await cancelFailureNotification();
    await scheduleFailureNotification(totalSeconds, failMessage.trim());

    startTimer(queue);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handleAbort = async () => {
    stopTimer();
    await clearSavedSession();
    await cancelFailureNotification();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const restSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${restSeconds.toString().padStart(2, '0')}`;
  };

  const renderStartStep = () => {
    if (currentStep === 0) {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepQuestion}>무엇을 목표할건가요?</Text>
          <TextInput
            style={styles.stepInput}
            placeholder="예: 발표 자료 완성"
            placeholderTextColor={Theme.colors.textSecondary}
            value={taskName}
            onChangeText={setTaskName}
            returnKeyType="next"
            onSubmitEditing={goToNextStep}
          />
          <AppButton title="다음" onPress={goToNextStep} disabled={!taskName.trim()} />
        </View>
      );
    }

    if (currentStep === 1) {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepQuestion}>몇 시간 동안 할건가요?</Text>
          <TextInput
            style={styles.stepInput}
            placeholder="예: 1 또는 1.5"
            placeholderTextColor={Theme.colors.textSecondary}
            keyboardType="decimal-pad"
            value={totalMinutes}
            onChangeText={setTotalMinutes}
            returnKeyType="next"
            onSubmitEditing={goToNextStep}
          />
          <Text style={styles.stepHint}>1 = 60분, 1.5 = 90분으로 계산됩니다.</Text>
          <AppButton title="다음" onPress={goToNextStep} disabled={getCalculatedMinutes() <= 0} />
        </View>
      );
    }

    if (currentStep === 2) {
      return (
        <View style={styles.stepContent}>
          <Text style={styles.stepQuestion}>실패시 나 자신에게 할 한마디는?</Text>
          <TextInput
            style={[styles.stepInput, styles.stepTextArea]}
            placeholder="예: 또 미뤘다. 이번엔 인정하고 다시 시작하자."
            placeholderTextColor={Theme.colors.textSecondary}
            multiline
            value={failMessage}
            onChangeText={setFailMessage}
          />
          <AppButton title="다음" onPress={goToNextStep} disabled={!failMessage.trim()} />
        </View>
      );
    }

    return (
      <View style={styles.stepContent}>
        <Text style={styles.readyTitle}>좋아요, 그러면 한번 해 보자고요!</Text>
        <Text style={styles.readyQuote}>{WARM_QUOTES[quoteIndex]}</Text>
        <AppButton title="스타트!" onPress={startBoxing} />
      </View>
    );
  };

  if (isBlackout) {
    return (
      <View style={styles.blackoutContainer}>
        <Text style={styles.blackoutTitle}>종료!</Text>
        <Text style={styles.blackoutSubText}>즉시 손을 떼십시오!</Text>
        <Text style={styles.blackoutDesc}>완벽주의는 죄악입니다.</Text>
        <AppButton title="인정하고 나가기" onPress={() => setIsBlackout(false)} variant="secondary" />
      </View>
    );
  }

  if (showDocs) {
    return (
      <View style={styles.docsContainer}>
        <View style={styles.docsHeader}>
          <AppButton
            title="홈으로 돌아가기"
            onPress={() => setShowDocs(false)}
            variant="secondary"
            style={styles.docsBackButton}
          />
        </View>
        <ScrollView style={styles.docsScroll} contentContainerStyle={styles.docsScrollContent}>
          <Text style={styles.docH1}>파킨슨의 법칙이란?</Text>
          <Text style={styles.docQuoteText}>"업무는 그것을 완수하는 데 할당된 시간만큼 늘어난다."</Text>
          <Text style={styles.docP}>영국의 노스코트 파킨슨이 말한 시간 관리 법칙입니다. 시간이 넉넉하면 우리는 일을 더 복잡하게 만들고, 중요하지 않은 세부사항에 시간을 채워 넣기 쉽습니다.</Text>
          <Text style={styles.docH2}>왜 파킨슨 킬러인가?</Text>
          <Text style={styles.docP}>이 앱은 일을 끝낼 때까지 시간을 쓰는 방식이 아니라, 먼저 시간을 가두고 그 안에서 핵심만 끝내도록 돕습니다. 목표를 정하고, 제한 시간을 정하고, 실패했을 때 스스로에게 남길 말을 적는 이유도 이 압박을 분명하게 만들기 위해서입니다.</Text>
          <Text style={styles.docH2}>사용법</Text>
          <Text style={styles.docP}>작업을 크게 설명하지 말고 오늘 끝낼 수 있는 단위로 적으세요. 시간은 여유 있게 잡기보다 조금 빠듯하게 잡는 편이 좋습니다. 완벽보다 완료를 먼저 선택하세요.</Text>
        </ScrollView>
      </View>
    );
  }

  if (isActive) {
    const currentTask = tasksQueue[currentTaskIndex];
    const nextTask = tasksQueue[currentTaskIndex + 1];

    return (
      <View style={styles.container}>
        <View style={styles.activeContainer}>
          <Text style={styles.activeLabel}>TIMEBOXING 진행 중</Text>
          <View style={styles.queueBoard}>
            <Text style={styles.queueHeader}>현재 달성중인 목표</Text>
            <Text style={styles.currentTaskName}>{currentTask?.name ?? taskName}</Text>
            {nextTask ? <Text style={styles.nextTaskText}>다음 목표: {nextTask.name}</Text> : null}
          </View>
          <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
          <View style={styles.failMessageBox}>
            <Text style={styles.failMessageLabel}>나와의 약속, 잊지 말 것</Text>
            <Text style={styles.failMessageText}>"{failMessage}"</Text>
          </View>
          <AppButton title="패배선언 (종료하기)" onPress={handleAbort} variant="danger" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.startContainer}>
      {!hasStartedFlow ? (
        <View style={styles.homeContent}>
          <Text style={styles.homeTitle}>파킨슨 킬러</Text>
          <AppButton title="시작하기" onPress={beginStartFlow} />
        </View>
      ) : (
        <Animated.View
          style={[
            styles.stepCard,
            {
              opacity: stepOpacity,
              transform: [{ translateX: stepAnim }],
            },
          ]}
        >
          {renderStartStep()}
        </Animated.View>
      )}

      <TouchableOpacity style={styles.lawLink} onPress={() => setShowDocs(true)}>
        <Text style={styles.lawLinkText}>파킨슨의 법칙이란?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    paddingTop: 50,
  },
  startContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.xl,
  },
  homeContent: {
    width: '100%',
    alignItems: 'center',
    gap: Theme.spacing.xxl,
  },
  homeTitle: {
    ...Theme.typography.title,
    fontSize: 38,
    textAlign: 'center',
  },
  stepCard: {
    width: '100%',
    maxWidth: 420,
  },
  stepContent: {
    width: '100%',
    gap: Theme.spacing.lg,
  },
  stepQuestion: {
    ...Theme.typography.heading,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  stepInput: {
    width: '100%',
    minHeight: 56,
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.md,
    color: Theme.colors.textPrimary,
    fontSize: 16,
    paddingHorizontal: Theme.spacing.lg,
  },
  stepTextArea: {
    minHeight: 120,
    paddingTop: Theme.spacing.lg,
    textAlignVertical: 'top',
  },
  stepHint: {
    ...Theme.typography.caption,
    textAlign: 'center',
    marginTop: -Theme.spacing.sm,
  },
  readyTitle: {
    ...Theme.typography.heading,
    textAlign: 'center',
  },
  readyQuote: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Theme.spacing.md,
  },
  lawLink: {
    position: 'absolute',
    right: Theme.spacing.xl,
    bottom: Theme.spacing.xl,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  lawLinkText: {
    ...Theme.typography.caption,
    color: Theme.colors.textSecondary,
  },
  activeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.xl,
  },
  activeLabel: {
    color: Theme.colors.accent,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: Theme.spacing.xxl,
  },
  queueBoard: {
    width: '100%',
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.xl,
    borderRadius: Theme.radius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.accent,
    marginBottom: Theme.spacing.xxl,
  },
  queueHeader: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
    marginBottom: Theme.spacing.lg,
  },
  currentTaskName: {
    color: Theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
  },
  nextTaskText: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
  },
  timerText: {
    fontSize: 88,
    color: Theme.colors.textPrimary,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    marginBottom: Theme.spacing.xxl,
  },
  failMessageBox: {
    marginTop: Theme.spacing.sm,
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.dangerSoft,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.danger,
    width: '100%',
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
  },
  failMessageLabel: {
    color: Theme.colors.danger,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: Theme.spacing.sm,
  },
  failMessageText: {
    color: Theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  blackoutContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.xl,
  },
  blackoutTitle: {
    fontSize: 70,
    color: Theme.colors.danger,
    fontWeight: '900',
    marginBottom: Theme.spacing.lg,
  },
  blackoutSubText: {
    fontSize: 30,
    color: Theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.xl,
    textAlign: 'center',
  },
  blackoutDesc: {
    fontSize: 18,
    color: Theme.colors.textSecondary,
    marginBottom: 80,
  },
  docsContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    paddingTop: 50,
  },
  docsHeader: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  docsBackButton: {
    alignSelf: 'flex-start',
  },
  docsScroll: {
    flex: 1,
  },
  docsScrollContent: {
    padding: Theme.spacing.xl,
    paddingBottom: 80,
  },
  docH1: {
    fontSize: 30,
    fontWeight: '900',
    color: Theme.colors.accent,
    marginBottom: Theme.spacing.xl,
    lineHeight: 38,
  },
  docH2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
    lineHeight: 30,
  },
  docP: {
    fontSize: 16,
    color: Theme.colors.textPrimary,
    lineHeight: 26,
    marginBottom: Theme.spacing.lg,
  },
  docQuoteText: {
    fontSize: 20,
    color: Theme.colors.danger,
    fontStyle: 'italic',
    fontWeight: 'bold',
    lineHeight: 28,
    marginBottom: Theme.spacing.xl,
  },
});
