import { Feather } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Image, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Colors } from '../../constants/theme';

type Step = {
  id: string | number;
  title?: string;
  description?: string;
  emoji?: string;
  image?: any;
  time?: number;
  timerType?: 'countdown' | 'stopwatch';
};

type Props = {
  steps: Step[];
  initialIndex?: number;
  onFinish?: () => void;
  onBackToDetails?: () => void;
};

const CookingSteps: React.FC<Props> = ({ steps, initialIndex = 0, onFinish, onBackToDetails }) => {
  const { width: screenWidth } = useWindowDimensions();

  const listRef = useRef<FlatList<Step> | null>(null);
  const [index, setIndex] = useState(initialIndex);

  const [remaining, setRemaining] = useState<number | null>(steps[initialIndex]?.time ?? null);
  const timerRef = useRef<any>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const t = steps[index]?.time ?? null;
    setRemaining(t);
    setRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [index, steps]);

  useEffect(() => {
    if (running && remaining != null) {
      timerRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r == null) return r;
          if (r <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
    return undefined;
  }, [running, remaining]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goTo = useCallback((i: number) => {
    if (i < 0 || i >= steps.length) return;
    setIndex(i);
    listRef.current?.scrollToIndex({ index: i, animated: true });
  }, [steps.length]);

  const onNext = () => {
    if (index + 1 >= steps.length) {
      onFinish?.();
    } else {
      goTo(index + 1);
    }
  };

  const onPrev = () => {
    goTo(Math.max(0, index - 1));
  };

  const handleTopBack = () => {
    if (index === 0) {
      onBackToDetails?.();
    } else {
      onPrev();
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<Step>) => {
    return (
      <View style={[styles.stepWrap, { width: screenWidth }]}>
        <View style={styles.imageWrap}>
          {item.emoji ? (
            <Text style={styles.emoji}>{item.emoji}</Text>
          ) : item.image ? (
            <Image source={item.image} style={styles.image} resizeMode="contain" />
          ) : (
            <View style={[styles.placeholder, styles.image]} /> 
          )}
        </View>

        <Text style={styles.stepTitle}>{item.title}</Text>
        <Text style={styles.stepDesc}>{item.description}</Text>

        {item.time != null && (
          <View style={styles.timerRow}>
            <Text style={[styles.timerText, { color: Colors.light.primary }]}>
                {formatTime(remaining ?? item.time)}
            </Text>
            <TouchableOpacity
              style={styles.timerButton}
              onPress={() => setRunning((r) => !r)}
            >
              <Text style={styles.timerButtonText}>{running ? 'Pausar' : 'Iniciar'}</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          onPress={onNext} 
          style={styles.mainNavBtn}
        >
          <Text style={styles.mainNavBtnText}>
            {index + 1 >= steps.length ? '¡Terminado!' : 'Siguiente Paso'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* VISTA SUPERIOR */}
      <View style={styles.topBar}>
        
        {/* BOTÓN SUPERIOR DE NAVEGACIÓN */}
        <TouchableOpacity 
            onPress={handleTopBack} 
            style={styles.backButton}
        >
            <Feather 
                name="arrow-left" 
                size={24} 
                color="#374151" 
            />
        </TouchableOpacity>

        {/* Paso X/Y */}
        <Text style={styles.stepCounter}>Paso {index + 1}/{steps.length}</Text>
        
        {/* BARRA DE PROGRESO SEGMENTADA */}
        <View style={styles.progressRow}>
            {steps.map((_, i) => (
                <TouchableOpacity 
                    key={i} 
                    onPress={() => goTo(i)} 
                    style={[
                        styles.progressBarSegment, 
                        i === index && styles.progressBarSegmentActive 
                    ]}
                />
            ))}
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={steps}
        keyExtractor={(s) => String(s.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        onMomentumScrollEnd={(ev) => {
          const offset = ev.nativeEvent.contentOffset.x;
          const newIndex = Math.round(offset / screenWidth);
          setIndex(newIndex);
        }}
        initialScrollIndex={initialIndex}
        getItemLayout={(data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
      />
    </View>
  );
};

function formatTime(sec: number | null) {
  if (sec == null) return '';
  const s = Math.max(0, sec);
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, '0');
  const ss = Math.floor(s % 60)
    .toString()
    .padStart(2, '0');
  return `${mm}:${ss}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  topBar: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 25, 
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 25,
    zIndex: 10,
    padding: 6,
  },
  stepCounter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 4,
    marginBottom: 0,
  },
  progressBarSegment: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressBarSegmentActive: {
    backgroundColor: Colors.light.primary,
  },

  stepWrap: { paddingHorizontal: 24, paddingBottom: 40, alignItems: 'center' },
  imageWrap: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FEF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
  },
  image: { width: 140, height: 140 },
  placeholder: { width: 140, height: 140, backgroundColor: 'transparent', borderRadius: 8 },
  emoji: {
    fontSize: 90,
  },
  stepTitle: { fontSize: 24, fontWeight: '700', color: '#111827', marginTop: 6, textAlign: 'center' }, 
  stepDesc: { color: '#6B7280', textAlign: 'center', marginTop: 8, fontSize: 16 }, 
  
  timerRow: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      marginTop: 24, 
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 10,
      backgroundColor: 'transparent', 
  },
  timerText: { fontSize: 22, fontWeight: '700', marginRight: 16 }, 
  timerButton: { 
      paddingVertical: 4, 
      paddingHorizontal: 10,
      borderRadius: 6, 
      borderWidth: 1, 
      borderColor: '#D1D5DB' 
  },
  timerButtonText: { color: '#374151', fontWeight: '500' }, 

  mainNavBtn: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 10,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  mainNavBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
  },
});

export default CookingSteps;