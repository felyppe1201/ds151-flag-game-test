import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { countries } from '../data/countries';
// @ts-ignore
import _ from '../../underscore-esm-min';

import { GameHeader } from '../components/GameHeaderTimer';
import { FlagQuestion } from '../components/FlagQuestion';
import { OptionButton } from '../components/OptionButton';
import { FeedbackScreen } from '../components/FeedbackScreen';

import { GetUser } from '../lib/userService';
import { useCronometro } from '../hooks/useCronometro';


interface Country {
  name: string;
  code: string;
}

type GameStatus = 'question' | 'hit' | 'miss' | 'end';

type scoreAtual = {
  name: string;
  score: number;
}


const GameScreen = () => {
  const [step, setStep] = useState<number>(1);
  const [status, setStatus] = useState<GameStatus>('question');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [chosenOption, setChosenOption] = useState<number>(-1);
  const [scoreAtualr, setScoreAtualr] = useState<scoreAtual | null>(null);
  const router = useRouter();
  const { username } = useLocalSearchParams<{ username: string }>();

  async function enviarDados(dados: scoreAtual | null) {
    try {
      if(dados != null){
        const resposta = await fetch('http://localhost:3000/timedscores', {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(dados),
        });
        console.log(dados);
        if (!resposta.ok) {
          throw new Error('Erro ao enviar os dados');
        }
      };
      if (dados == null){
        throw new Error('Dados nulos');
      }

      
    } catch (error) {
      console.log(error);
      console.log("Erro ao enviar");
    }
  }

  const nextStep = () => {
    setStatus('question');
    setChosenOption(-1);
  }

  const tempoRestante = useCronometro(30, () => {
    setStatus('end');
  });

  useEffect(() => {
    if (username != null) {
      setScoreAtualr({
        name: username,
        score: 0
      });
    }
  }, []);

  useEffect(() => {
    if (scoreAtualr) {
      console.log(scoreAtualr.name);
      console.log(scoreAtualr.score);
    }
  }, [scoreAtualr]);

  const confirmTry = () => {
    if (selectedCountry && options[chosenOption] && selectedCountry.name === options[chosenOption].name) {
      let score: number;
      score = scoreAtualr?.score + 1
      setScoreAtualr({
        name: scoreAtualr?.name,
        score: score,
      })
      setStatus('hit')
    }
    else {
      setStatus('miss')
    }
    setStep((s) => s + 1);
  }

  useEffect(() => {
    if (status === 'question') {
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      setSelectedCountry(randomCountry);
    }
  }, [status]);

  useEffect(() => {
    if (selectedCountry) {
      let optionsArray = _.sample(countries, 3);
      optionsArray.push(selectedCountry);
      setOptions(_.shuffle(optionsArray));
    }
  }, [selectedCountry])

  if (status !== 'question') {
    return (
      <FeedbackScreen
        status={status}
        username={username}
        points={scoreAtualr?.score}
        onContinue={nextStep}
        onRestart={() => {
          setScoreAtualr({
            name: username,
            score: 0
          });
          setStep(1);
          setStatus('question');
          enviarDados(scoreAtualr);
        }}
        onQuit={() => {
          enviarDados(scoreAtualr);
          router.replace('/')}}
      />
    );
  }

  if (!selectedCountry) return (<Text>Carregando ...</Text>)

  return (
    <SafeAreaView style={styles.container}>
      <GameHeader 
        onClose={() => router.replace('/')}
        timer={tempoRestante}
        points={scoreAtualr?.score | 0}
      />
      
      <FlagQuestion 
        username={username || 'Jogador'}
        countryCode={selectedCountry.code}
      />

      <View style={styles.optionsContainer}>
        {options.map((option, idx) => (
          <OptionButton
            key={idx}
            label={option.name}
            isSelected={idx === chosenOption}
            onPress={() => setChosenOption(idx)}
          />
        ))}
      </View>

      <View style={styles.confirmContainer}>
        <Button
          title="Confirmar"
          color="green"
          disabled={chosenOption === -1}
          onPress={confirmTry}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    justifyContent: 'center',
  },
  optionsContainer: {
    flex: 4,
    justifyContent: 'space-evenly',
  },
  confirmContainer: {
    flex: 1,
    margin: 50,
  },
});

export default GameScreen;