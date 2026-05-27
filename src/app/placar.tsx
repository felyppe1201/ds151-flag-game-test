import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

type Score = {
  id?: number;
  name: string;
  score: number;
};

const PlacarScreen = () => {
  const [lista, setLista] = useState<Score[]>([]);
  const [modo, setModo] = useState<'scores' | 'timedscores'>('scores');
  const router = useRouter();

  async function receberDados(rota: 'scores' | 'timedscores') {
    try {
      const resposta = await fetch(`http://localhost:3000/${rota}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!resposta.ok) {
        throw new Error('Erro ao receber os dados');
      }

      const dados: Score[] = await resposta.json();
      setLista(dados);
    } catch (error) {
      console.log(error);
      console.log('Erro ao receber');
    }
  }

  useEffect(() => {
    receberDados(modo);
  }, [modo]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Placar</Text>

      <View style={styles.botoesContainer}>
        <TouchableOpacity onPress={() => router.replace('/')}>
            <AntDesign style={styles.buttonClose} name="close" size={24} color="black" />
        </TouchableOpacity>
        <Button
          title="Placar"
          color={modo === 'scores' ? 'rgb(0, 135, 202)' : '#aaa'}
          onPress={() => setModo('scores')}
        />
        <Button
          title="Placar Timer"
          color={modo === 'timedscores' ? 'rgb(0, 135, 202)' : '#aaa'}
          onPress={() => setModo('timedscores')}
        />
      </View>

      <FlatList
        data={lista}
        keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma pontuação registrada :(</Text>
        }
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.posicao}>{index + 1}º</Text>
            <Text style={styles.nome}>{item.name}</Text>
            <Text style={styles.score}>{item.score} pts</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    buttonClose: {
    flex: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  titulo: {
    fontSize: 32,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginVertical: 20,
    color: 'rgb(0, 135, 202)',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  posicao: {
    fontSize: 18,
    fontFamily: 'monospace',
    color: '#888',
    width: 36,
  },
  nome: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'monospace',
    color: 'rgb(0, 135, 202)',
  },
  score: {
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#080',
  },
  vazio: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
    fontFamily: 'monospace',
  },
});

export default PlacarScreen;