import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const Home = () => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scroll: { flex: 1 },
});

export default Home;
