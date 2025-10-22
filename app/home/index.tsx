import { ScrollView, StyleSheet, View } from 'react-native';
import HomeHeader from '../../components/home/HomeHeader';
import QuickSuggestionCard from '../../components/home/QuickSuggestionCard';
import { usePlanner } from '../../hooks/usePlanner';

const Home = () => {
  const { recipes } = usePlanner('user123');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <HomeHeader />

        <View style={styles.section}>
          {(() => {
            const suggestionCount = 3;
            const suggestions = recipes?.slice(0, suggestionCount) ?? [];
            const suggestionIds = new Set(suggestions.map(s => s.id));
            const rest = recipes?.filter(r => !suggestionIds.has(r.id)) ?? [];

            return (
              <>
                {suggestions.map((r) => (
                  <QuickSuggestionCard
                    key={`qs-${r.id}`}
                    id={r.id}
                    title={r.name}
                    time={`${r.time} min`}
                    difficulty={r.difficulty}
                    ingredients={r.ingredients}
                    calories={r.calories}
                    icon={r.icon}
                  />
                ))}
                {rest.map((r) => (
                  <QuickSuggestionCard
                    key={`rc-${r.id}`}
                    id={r.id}
                    title={r.name}
                    time={`${r.time} min`}
                    difficulty={r.difficulty}
                    ingredients={r.ingredients}
                    calories={r.calories}
                    icon={r.icon}
                  />
                ))}
              </>
            );
          })()}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scroll: { flex: 1 },
  section: { paddingHorizontal: 10, marginTop: 14 },
});

export default Home;