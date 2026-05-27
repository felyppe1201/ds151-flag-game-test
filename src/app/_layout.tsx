import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Jogo das Bandeiras',
          }}
        />
        <Stack.Screen
          name="game"
          options={{
            title: 'Jogo',
          }}
        />
        <Stack.Screen
          name="gametimer"
          options={{
            title: 'Jogo temporizado',
          }}
        />
        <Stack.Screen
        name="placar"
        options={{
            title: 'Leaderboard',
          }}/>
      </Stack>
    </SafeAreaProvider>
  );
}
