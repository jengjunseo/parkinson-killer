import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function TabTwoScreen() {
  const [showContent, setShowContent] = useState(0);

  const content = [
    {
      title: "🤔 당신의 시간을 갉아먹는 유령",
      subtitle: "분명 1시간이면 끝날 일인데, 왜 하루 종일 붙잡고 있을까?",
      content: `혹시 이런 경험 있으신가요? 🤦‍♂️
시험 공부를 한 달 전부터 시작했는데 결국 전날 밤을 새우거나, 오후 5시까지 제출하면 되는 간단한 보고서를 퇴근 직전까지 붙잡고 수정하며 끙끙댔던 경험 말이죠.

우리는 보통 '시간이 부족해서' 일을 다 못 끝낸다고 생각합니다. 하지만 영국의 경영학자 노스코트 파킨슨은 정반대의 날카로운 진단을 내놓았습니다. ⚡`
    },
    {
      title: "📜 파킨슨의 법칙",
      subtitle: "\"업무는 그것을 완수하는 데 할당된 시간만큼 늘어난다.\"",
      content: `- 노스코트 파킨슨

이것이 바로 그 유명한 파킨슨의 법칙(Parkinson's Law)입니다.`
    },
    {
      title: "⏳ 시간은 고무줄처럼 늘어납니다",
      subtitle: "노부인 엽서 사례",
      content: `파킨슨은 아주 흥미로운 사례를 들었습니다. 한가로운 노부인이 조카에게 엽서 한 장을 보내는 상황입니다.

• 엽서를 고르는 데 1시간
• 돋보기를 찾는 데 30분  
• 주소를 적는 데 30분
• 문장을 고민하는 데 1시간...

바쁜 사람이라면 3분 만에 끝낼 이 간단한 일이, 노부인에게는 '하루 종일 걸리는 대공사'가 됩니다. 왜일까요?

사용할 수 있는 시간이 '하루 종일'이기 때문입니다. 우리 뇌는 남는 시간을 견디지 못하고, 그 빈틈을 채우기 위해 일을 자꾸만 더 복잡하고 중요하게 부풀립니다. 🤯`
    },
    {
      title: "🚀 파킨슨의 덫에서 탈출하는 법",
      subtitle: "실천 전략",
      content: `이 법칙을 알게 된 이상, 이제 '시간의 노예'가 되지 않을 수 있습니다.

1️⃣ 시간을 먼저 가두세요:
"이 일은 다 할 때까지 하겠다"가 아니라, "이 일에 딱 30분만 쓰겠다"라고 시간의 상자(Timebox)를 먼저 만드세요.

2️⃣ 마감을 앞당기세요:
일주일 뒤가 마감이라면, 스스로 오늘 오후를 마감으로 정해보세요. 시간이 부족해지면 우리 뇌는 비로소 '가장 중요한 핵심'에만 집중하기 시작합니다.

3️⃣ '완벽'보다 '완료'를:
시간이 많으면 폰트 크기나 배경 색상 같은 사소한 것에 집착하게 됩니다. 우선 끝내는 것에 집중하세요.`
    },
    {
      title: "💡 결론",
      subtitle: "시간이 많다는 것은 축복이 아니라, 저주일 수 있습니다",
      content: `"시간이 많다는 것은 축복이 아니라, 일을 늘리는 저주일 수도 있습니다." ☠️

오늘 여러분의 할 일 목록을 다시 한번 살펴보세요. 혹시 1시간이면 충분할 일에 '하루'라는 너무 큰 옷을 입혀두지는 않았나요?

지금 당장 그 옷을 줄여보세요. 놀라운 집중력이 당신을 찾아올 것입니다! ✨`
    }
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <IconSymbol
          size={60}
          color="#FFD700"
          name="brain.head.profile"
          style={styles.headerIcon}
        />
        <ThemedText type="title" style={styles.headerTitle}>
          파킨슨 교육
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          시간의 주인이 되는 법
        </ThemedText>
      </View>
      
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {content.map((item, index) => (
          <View key={index} style={styles.contentSection}>
            <ThemedText style={styles.contentTitle}>{item.title}</ThemedText>
            <ThemedText style={styles.contentSubtitle}>{item.subtitle}</ThemedText>
            <ThemedText style={styles.contentText}>{item.content}</ThemedText>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerIcon: {
    marginBottom: 15,
  },
  headerTitle: {
    color: '#FFD700',
    marginBottom: 5,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#AAA',
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  contentSection: {
    marginBottom: 25,
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFD700',
    marginBottom: 8,
  },
  contentSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 12,
    lineHeight: 22,
  },
  contentText: {
    fontSize: 15,
    color: '#EEEEEE',
    lineHeight: 22,
  },
});
