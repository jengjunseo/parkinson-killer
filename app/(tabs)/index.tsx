import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, Animated, Dimensions, ScrollView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTimer, SubTask } from '../../src/services/timer/useTimer';
import { AppButton } from '../../components/ui/AppButton';
import { Theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

const TIMER_KEY = '@pk_timer_v4';

const QUOTES_LIST = [
  "지옥을 걷고 있다면, 계속 걸어가라.",
  "마감은 최고의 영감이다.",
  "완벽주의는 나태함의 화장이다.",
  "지금 쉬면 내일은 뛰어야 한다.",
  "성공은 매일 반복되는 작은 노력의 합계다.",
  "파킨슨의 법칙: 일은 주어진 시간을 모두 채울 때까지 팽창한다.",
  "시작이 반이다, 나머지는 기합이다.",
  "미루는 습관은 당신의 영혼을 갉아먹는다.",
  "변명 속에는 어떤 성공도 자라지 않는다.",
  "고통은 일시적이지만 결과는 영원하다.",
  "의지력은 바닥나기 전에 습관으로 만들어라.",
  "당신이 자초한 시간낭비는 누구도 보상해주지 않는다.",
  "생각은 짧게, 행동은 맹렬하게.",
  "시간은 당신을 기다려주지 않는다.",
  "스마트폰을 내려놓고 인생을 쥐어라.",
  "오늘을 버리고 내일을 바라는 건 정신병이다.",
  "피곤하다고? 승자들은 눈물을 흘리며 전진했다.",
  "행동하지 않는 아이디어는 쓰레기에 불과하다.",
  "모든 성취는 '하기 싫음'을 이겨낸 결과물이다.",
  "타이머가 도는 순간 당신은 짐승처럼 일해야 한다.",
  "자신과의 타협은 패배의 지름길이다.",
  "땀방울로 쓴 역사는 지워지지 않는다.",
  "당신의 한계를 정하는 것은 당신의 게으름뿐이다.",
  "집중하라, 세상이 무너져도.",
  "과거를 핑계로 현재를 낭비하지 마라.",
  "완수하는 자만이 휴식의 달콤함을 안다.",
  "시간은 가장 비싸지만 당신은 너무 싸게 팔고 있다.",
  "할 수 있다고 믿든, 할 수 없다고 믿든, 당신의 믿음은 현실이 된다.",
  "지금 당장 변하지 않으면 당신은 어제 그대로 죽는다.",
  "파킨슨 킬러가 너를 지켜보고 있다. 증명해라."
];
const QUOTES_STRING = QUOTES_LIST.join("   🔥   ");

const PARKINSON_CONTENT = [
  "🤔 분명 1시간이면 끝날 일인데, 왜 하루 종일 붙잡고 있을까?\n\n(당신의 시간을 갉아먹는 유령의 정체...)",
  "📜 \"업무는 그것을 완수하는 데 할당된 시간만큼 늘어난다.\" \n\n- 노스코트 파킨슨",
  "👵 (노부인 엽서 사례)\n3분이면 될 일이 하루 종일 걸리는 대공사가 되는 이유:\n\n\"시간이 하루 종일 있기 때문!\"",
  "🚀 파킨슨의 덫 탈출법\n\n1. 시간을 먼저 가두세요 (Timebox)\n2. 마감을 앞당기세요\n3. '완벽'보다 '완료'를!",
  "💡 결론\n\n혹시 오늘, 1시간이면 충분할 일에 '하루'라는 너무 큰 옷을 입혀두지는 않았나요?\n지금 당장 그 옷을 줄이세요."
];

export default function TimeBoxingScreen() {
  const [taskName, setTaskName] = useState('');
  const [totalMinutes, setTotalMinutes] = useState('');
  const [failMessage, setFailMessage] = useState('');
  const [subTasks, setSubTasks] = useState<{name: string, mins: string}[]>([]);
  const [newSubTaskName, setNewSubTaskName] = useState('');
  const [newSubTaskMins, setNewSubTaskMins] = useState('');
  
  const [isBlackout, setIsBlackout] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  const marqueeAnim = useRef(new Animated.Value(width)).current;

  // 컴포넌트 마운트 시 타이머 복구 여부 확인
  useEffect(() => {
    checkExistingTimer();
  }, []);

  const checkExistingTimer = async () => {
    const stored = await AsyncStorage.getItem(TIMER_KEY);
    if (stored) {
      const { endTime, total, failMsg, task } = JSON.parse(stored);
      const now = Date.now();
      if (endTime > now) {
        setFailMessage(failMsg || '');
        setTaskName(task || '');
        // Note: useTimer의 state를 복원하기 위해선 useTimer 내부에서 처리해야 하므로,
        // 현재는 AsyncStorage를 기반으로 단순 유지 로직을 넣거나,
        // 새로 시작하는 방향으로 처리해야 함. 현재 useTimer 구조상 완전 복구는 
        // 큐를 다 저장해야 가능함. 이 데모버전에서는 저장된 시간만 확인합니다.
      } else {
        await AsyncStorage.removeItem(TIMER_KEY);
      }
    }
  };

  useEffect(() => {
    marqueeAnim.setValue(width);
    Animated.loop(
      Animated.timing(marqueeAnim, {
        toValue: -20000,
        duration: 300000, // 더 천천히 (속도 저하)
        useNativeDriver: true,
      })
    ).start();
  }, [marqueeAnim]);

  const handleEndComplete = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    await AsyncStorage.removeItem(TIMER_KEY);
    setIsBlackout(true);
  };

  const {
    tasksQueue,
    currentTaskIndex,
    remainingTime,
    isActive,
    startTimer,
    stopTimer
  } = useTimer(handleEndComplete);

  const addSubTask = () => {
    if (!newSubTaskName || !newSubTaskMins) return;
    setSubTasks([...subTasks, { name: newSubTaskName, mins: newSubTaskMins }]);
    setNewSubTaskName('');
    setNewSubTaskMins('');
    Keyboard.dismiss();
  };

  const removeSubTask = (index: number) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };

  const startBoxing = async () => {
     if (!taskName || !totalMinutes || !failMessage.trim()) return;
     Keyboard.dismiss();

     const queue: SubTask[] = [];
     let totalSeconds = 0;
     if (subTasks.length > 0) {
        subTasks.forEach((st, idx) => {
           const secs = parseInt(st.mins) * 60;
           queue.push({ id: idx.toString(), name: st.name, durationSec: secs });
           totalSeconds += secs;
        });
     } else {
        totalSeconds = parseInt(totalMinutes) * 60;
        queue.push({ id: 'main', name: taskName, durationSec: totalSeconds });
     }

     const endTime = Date.now() + totalSeconds * 1000;
     await AsyncStorage.setItem(TIMER_KEY, JSON.stringify({ endTime, total: totalSeconds, failMsg: failMessage, task: taskName }));

     // 실패 알림(백그라운드)스케줄
     if (Platform.OS !== 'web') {
       await Notifications.cancelAllScheduledNotificationsAsync();
       await Notifications.scheduleNotificationAsync({
         content: {
           title: "🚨 배신자 🚨",
           body: `"${failMessage}"`,
           sound: true,
         },
         trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: totalSeconds, repeats: false },
       });
     }

     startTimer(queue);
     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAbort = async () => {
     stopTimer();
     await AsyncStorage.removeItem(TIMER_KEY);
     if (Platform.OS !== 'web') {
       await Notifications.cancelAllScheduledNotificationsAsync();
     }
  };

  if (isBlackout) {
    return (
      <View style={styles.blackoutContainer}>
        <Text style={styles.blackoutTitle}>종료!</Text>
        <Text style={styles.blackoutSubText}>즉시 손을 떼십시오!</Text>
        <Text style={styles.blackoutDesc}>(완벽주의는 죄악입니다)</Text>
        <AppButton
          title="인정하고 나가기"
          onPress={() => setIsBlackout(false)}
          variant="secondary"
        />
      </View>
    );
  }

  if (showDocs) {
    return (
      <View style={styles.docsContainer}>
        <View style={styles.docsHeader}>
          <AppButton
            title="← 홈으로 돌아가기"
            onPress={() => setShowDocs(false)}
            variant="secondary"
            style={styles.docsBackButton}
          />
        </View>
        <ScrollView style={styles.docsScroll} contentContainerStyle={styles.docsScrollContent}>
           <Text style={styles.docH1}>🕒 당신의 시간을 갉아먹는 유령</Text>
           <Text style={styles.docH2}>"분명 1시간이면 끝날 일인데, 왜 하루 종일 붙잡고 있을까?"</Text>
           
           <Text style={styles.docP}>혹시 이런 경험 있으신가요? 🤦‍♂️</Text>
           <Text style={styles.docP}>시험 공부를 한 달 전부터 시작했는데 결국 전날 밤을 새우거나, 오후 5시까지 제출하면 되는 간단한 보고서를 퇴근 직전까지 붙잡고 수정하며 끙끙댔던 경험 말이죠.</Text>

           <Text style={styles.docP}>우리는 보통 '시간이 부족해서' 일을 다 못 끝낸다고 생각합니다. 하지만 영국의 경영학자 노스코트 파킨슨은 정반대의 날카로운 진단을 내놓았습니다. ⚡</Text>

           <View style={styles.docQuoteBox}>
             <Text style={styles.docQuoteText}>"업무는 그것을 완수하는 데 할당된 시간만큼 늘어난다."</Text>
           </View>

           <Text style={styles.docP}>이것이 바로 그 유명한 <Text style={styles.docBold}>파킨슨의 법칙(Parkinson's Law)</Text>입니다.</Text>

           <Text style={styles.docPSpacer} />
           
           <Text style={styles.docH1}>⏳ 시간은 고무줄처럼 늘어납니다</Text>
           <Text style={styles.docP}>파킨슨은 아주 흥미로운 사례를 들었습니다. 한가로운 노부인이 조카에게 엽서 한 장을 보내는 상황입니다.</Text>
           
           <View style={styles.docListBox}>
             <Text style={styles.docListItem}>• 엽서를 고르는 데 1시간</Text>
             <Text style={styles.docListItem}>• 돋보기를 찾는 데 30분</Text>
             <Text style={styles.docListItem}>• 주소를 적는 데 30분</Text>
             <Text style={styles.docListItem}>• 문장을 고민하는 데 1시간...</Text>
           </View>

           <Text style={styles.docP}>바쁜 사람이라면 3분 만에 끝낼 이 간단한 일이, 노부인에게는 <Text style={styles.docBold}>'하루 종일 걸리는 대공사'</Text>가 됩니다. 왜일까요?</Text>
           <Text style={styles.docP}>사용할 수 있는 시간이 '하루 종일'이기 때문입니다. 우리 뇌는 남는 시간을 견디지 못하고, 그 빈틈을 채우기 위해 일을 자꾸만 더 복잡하고 중요하게 부풀립니다. 🤯</Text>

           <Text style={styles.docPSpacer} />

           <Text style={styles.docH1}>🚀 파킨슨의 덫에서 탈출하는 법</Text>
           <Text style={styles.docP}>이 법칙을 알게 된 이상, 이제 '시간의 노예'가 되지 않을 수 있습니다.</Text>

           <View style={styles.docTipsBox}>
             <Text style={styles.docP}><Text style={styles.docBold}>1️⃣ 시간을 먼저 가두세요:</Text> "이 일은 다 할 때까지 하겠다"가 아니라, "이 일에 딱 30분만 쓰겠다"라고 <Text style={styles.docBold}>시간의 상자(Timebox)</Text>를 먼저 만드세요.</Text>
             <Text style={styles.docP}><Text style={styles.docBold}>2️⃣ 마감을 앞당기세요:</Text> 일주일 뒤가 마감이라면, 스스로 오늘 오후를 마감으로 정해보세요. 시간이 부족해지면 우리 뇌는 비로소 '가장 중요한 핵심'에만 집중하기 시작합니다.</Text>
             <Text style={styles.docP}><Text style={styles.docBold}>3️⃣ '완벽'보다 '완료'를:</Text> 시간이 많으면 폰트 크기나 배경 색상 같은 사소한 것에 집착하게 됩니다. 우선 끝내는 것에 집중하세요.</Text>
           </View>

           <Text style={styles.docPSpacer} />

           <Text style={styles.docH2}>"시간이 많다는 것은 축복이 아니라, 일을 늘리는 저주일 수도 있습니다." ☠️</Text>
           <Text style={styles.docP}>오늘 여러분의 할 일 목록을 다시 한번 살펴보세요. 혹시 1시간이면 충분할 일에 '하루'라는 너무 큰 옷을 입혀두지는 않았나요?</Text>
           <Text style={styles.docP}>지금 당장 그 옷을 줄여보세요. 놀라운 집중력이 당신을 찾아올 것입니다! ✨</Text>

        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.marqueeWrapper}>
        <View style={styles.marqueeContainer}>
          <Animated.Text style={[styles.marqueeText, { transform: [{ translateX: marqueeAnim }] }]} numberOfLines={1}>
             {QUOTES_STRING}   🔥   {QUOTES_STRING}
          </Animated.Text>
        </View>
      </View>

      {isActive ? (
        <View style={styles.activeContainer}>
           <Text style={styles.activeLabel}>TIMEBOXING 진행 중</Text>
           
           <View style={styles.queueBoard}>
             <Text style={styles.queueHeader}>현재 달성중인 서브 태스크</Text>
             <Text style={styles.currentTaskName}>{tasksQueue[currentTaskIndex]?.name}</Text>
             
             {currentTaskIndex + 1 < tasksQueue.length && (
               <Text style={styles.nextTaskText}>다음 목표: {tasksQueue[currentTaskIndex + 1]?.name}</Text>
             )}
           </View>

           <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
           
           <View style={styles.failMessageBox}>
             <Text style={styles.failMessageLabel}>[나와의 약속, 잊지 말 것]</Text>
             <Text style={styles.failMessageText}>"{failMessage}"</Text>
           </View>
           
           <AppButton
              title="패배선언 (종료하기)"
              onPress={handleAbort}
              variant="danger"
           />
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>타임박싱(Timeboxing)</Text>
          <Text style={styles.subtitle}>몇 분 동안 어떻게 집중할 것인가?</Text>

          <TextInput
            style={styles.input}
            placeholder="목표 (예: 핵심 기능 배포)"
            placeholderTextColor="#666"
            value={taskName}
            onChangeText={setTaskName}
          />
          <TextInput
            style={styles.input}
            placeholder="원래 사용할 전체 시간 (분)"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={totalMinutes}
            onChangeText={setTotalMinutes}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="[필수] 실패 시 나 자신에게 할 쓰디쓴 한마디"
            placeholderTextColor="#666"
            multiline
            value={failMessage}
            onChangeText={setFailMessage}
          />

          <View style={styles.subtaskSection}>
             <Text style={styles.subtaskHeader}>잘게 쪼개기 (Micro-Deadlines)</Text>
             <Text style={styles.subtaskDesc}>서브 태스크를 추가하면 전체 시간은 서브 태스크들의 합으로 계산됩니다.</Text>
             <View style={styles.subtaskInputRow}>
               <TextInput 
                 style={[styles.inputSub, { flex: 2 }]} 
                 placeholder="세부 태스크명" 
                 placeholderTextColor="#666"
                 value={newSubTaskName}
                 onChangeText={setNewSubTaskName}
               />
               <TextInput 
                 style={[styles.inputSub, { flex: 1 }]} 
                 placeholder="할당(분)" 
                 keyboardType="numeric"
                 placeholderTextColor="#666"
                 value={newSubTaskMins}
                 onChangeText={setNewSubTaskMins}
               />
               <AppButton
                 title="+"
                 onPress={addSubTask}
                 variant="icon"
               />
             </View>

             {subTasks.map((item, index) => (
                <View key={index} style={styles.subtaskItem}>
                  <Text style={styles.subtaskItemText}>- {item.name} ({item.mins}분)</Text>
                  <TouchableOpacity onPress={() => removeSubTask(index)} style={styles.removeBtn}>
                    <Text style={styles.removeText}>✖</Text>
                  </TouchableOpacity>
                </View>
             ))}
          </View>

          <AppButton
            title="파킨슨 박스 스위치 온 🔥"
            onPress={startBoxing}
            variant="primary"
            disabled={!taskName || !totalMinutes || !failMessage}
            style={[(!taskName || !totalMinutes || !failMessage) && {opacity: 0.4}]}
          />

          <AppButton
            title="📖 당신은 왜 시간의 노예인가? (파킨슨의 법칙 알아보기)"
            onPress={() => setShowDocs(true)}
            variant="secondary"
          />

        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, paddingTop: 50 },
  marqueeWrapper: { paddingHorizontal: Theme.spacing.xl, marginBottom: Theme.spacing.sm },
  marqueeContainer: { 
    width: '100%', 
    height: 40, 
    overflow: 'hidden', 
    backgroundColor: Theme.colors.surfaceAlt, 
    justifyContent: 'center', 
    borderRadius: Theme.radius.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border
  },
  marqueeText: { fontSize: 13, color: Theme.colors.textSecondary, fontWeight: 'bold', width: 30000 },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: Theme.spacing.xl, paddingBottom: 60 },
  title: { ...Theme.typography.title, marginBottom: Theme.spacing.sm, marginTop: Theme.spacing.lg },
  subtitle: { ...Theme.typography.caption, marginBottom: Theme.spacing.xl },
  input: { 
    backgroundColor: Theme.colors.surface, 
    color: Theme.colors.textPrimary, 
    height: 55, 
    borderRadius: Theme.radius.md, 
    paddingHorizontal: Theme.spacing.lg, 
    fontSize: 16, 
    marginBottom: Theme.spacing.lg, 
    borderWidth: 1, 
    borderColor: Theme.colors.border, 
    width: '100%' 
  },
  textArea: { 
    minHeight: 100, 
    paddingTop: 15, 
    textAlignVertical: 'top', 
    borderColor: Theme.colors.danger, 
    borderWidth: 1.5 
  },
  subtaskSection: { marginTop: Theme.spacing.sm, width: '100%' },
  subtaskHeader: { color: Theme.colors.accent, fontSize: 16, fontWeight: 'bold', marginBottom: Theme.spacing.sm },
  subtaskDesc: { color: Theme.colors.textSecondary, fontSize: 12, marginBottom: Theme.spacing.lg },
  subtaskInputRow: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.sm, marginBottom: Theme.spacing.lg },
  inputSub: { 
    backgroundColor: Theme.colors.surface, 
    color: Theme.colors.textPrimary, 
    height: 45, 
    borderRadius: Theme.radius.sm, 
    paddingHorizontal: Theme.spacing.lg, 
    borderWidth: 1, 
    borderColor: Theme.colors.border 
  },
  subtaskItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: Theme.colors.surfaceAlt, 
    padding: Theme.spacing.lg, 
    borderRadius: Theme.radius.sm, 
    marginBottom: Theme.spacing.sm 
  },
  subtaskItemText: { color: Theme.colors.textPrimary, fontSize: 15, fontWeight: '600' },
  removeBtn: { padding: Theme.spacing.sm },
  removeText: { color: Theme.colors.danger, fontWeight: '900', fontSize: 16 },
  activeContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Theme.spacing.xl },
  activeLabel: { color: Theme.colors.accent, fontSize: 18, fontWeight: '900', marginBottom: Theme.spacing.xxl },
  queueBoard: { 
    width: '100%', 
    backgroundColor: Theme.colors.surface, 
    padding: Theme.spacing.xl, 
    borderRadius: Theme.radius.lg, 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: Theme.colors.accent, 
    marginBottom: Theme.spacing.xxl 
  },
  queueHeader: { color: Theme.colors.textSecondary, fontSize: 13, marginBottom: Theme.spacing.lg },
  currentTaskName: { color: Theme.colors.textPrimary, fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: Theme.spacing.lg },
  nextTaskText: { color: Theme.colors.textSecondary, fontSize: 13 },
  timerText: { fontSize: 100, color: Theme.colors.textPrimary, fontWeight: '900', fontVariant: ['tabular-nums'], marginBottom: Theme.spacing.xxl },
  
  failMessageBox: { 
    marginTop: Theme.spacing.sm, 
    padding: Theme.spacing.lg, 
    backgroundColor: Theme.colors.dangerSoft, 
    borderRadius: Theme.radius.md, 
    borderWidth: 1, 
    borderColor: Theme.colors.danger, 
    width: '100%', 
    alignItems: 'center', 
    marginBottom: Theme.spacing.xxl 
  },
  failMessageLabel: { color: Theme.colors.danger, fontSize: 12, fontWeight: '800', marginBottom: Theme.spacing.sm },
  failMessageText: { color: Theme.colors.textPrimary, fontSize: 20, fontWeight: 'bold', textAlign: 'center' },

  blackoutContainer: { flex: 1, backgroundColor: Theme.colors.background, alignItems: 'center', justifyContent: 'center' },
  blackoutTitle: { fontSize: 70, color: Theme.colors.danger, fontWeight: '900', marginBottom: Theme.spacing.lg },
  blackoutSubText: { fontSize: 30, color: Theme.colors.textPrimary, fontWeight: 'bold', marginBottom: Theme.spacing.xl },
  blackoutDesc: { fontSize: 18, color: Theme.colors.textSecondary, marginBottom: 80 },
  
  docsContainer: { flex: 1, backgroundColor: Theme.colors.background, paddingTop: 50 },
  docsHeader: { paddingHorizontal: Theme.spacing.xl, paddingBottom: Theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: Theme.colors.border },
  docsBackButton: { alignSelf: 'flex-start' },
  docsScroll: { flex: 1 },
  docsScrollContent: { padding: Theme.spacing.xl, paddingBottom: 80 },
  
  docH1: { fontSize: 28, fontWeight: '900', color: Theme.colors.accent, marginBottom: Theme.spacing.xl, lineHeight: 36 },
  docH2: { fontSize: 22, fontWeight: 'bold', color: Theme.colors.danger, marginBottom: Theme.spacing.xl, lineHeight: 30 },
  docP: { fontSize: 16, color: Theme.colors.textPrimary, lineHeight: 26, marginBottom: Theme.spacing.lg },
  docPSpacer: { height: 25 },
  docBold: { fontWeight: '900', color: Theme.colors.textPrimary },
  docQuoteBox: { 
    backgroundColor: Theme.colors.surface, 
    padding: Theme.spacing.xl, 
    borderRadius: Theme.radius.md, 
    borderLeftWidth: 5, 
    borderLeftColor: Theme.colors.danger, 
    marginVertical: Theme.spacing.xl 
  },
  docQuoteText: { fontSize: 20, color: Theme.colors.textPrimary, fontStyle: 'italic', fontWeight: 'bold', lineHeight: 28 },
  docListBox: { 
    backgroundColor: Theme.colors.surfaceAlt, 
    padding: Theme.spacing.lg, 
    borderRadius: Theme.radius.sm, 
    marginVertical: Theme.spacing.lg 
  },
  docListItem: { color: Theme.colors.textSecondary, fontSize: 16, marginBottom: Theme.spacing.sm },
  docTipsBox: { 
    backgroundColor: 'rgba(22, 163, 74, 0.1)', 
    padding: Theme.spacing.xl, 
    borderRadius: Theme.radius.md, 
    borderWidth: 1, 
    borderColor: Theme.colors.success, 
    marginVertical: Theme.spacing.xl 
  },
});
