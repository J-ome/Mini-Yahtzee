import React, { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Container, Row, Col } from 'react-native-flex-grid';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import Footer from './Footer';
import styles from '../style/style';
import { NBR_OF_DICES, NBR_OF_THROWS, MIN_SPOT, MAX_SPOT, MAX_ROUNDS, BONUS_POINTS_LIMIT, BONUS_POINTS, SCOREBOARD_KEY } from '../constants/Game';

let board = [];

const Gameboard = ({ navigation, route}) => {
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
  const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
  const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));
  const [assignedPoints, setAssignedPoints] = useState(new Array(MAX_SPOT).fill(false));
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [assigningPoints, setAssigningPoints] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [remainingPointsToBonus, setRemainingPointsToBonus] = useState(BONUS_POINTS_LIMIT - totalPoints);

  useEffect(() => {
    if (playerName === '' && route.params?.player) {
      setPlayerName(route.params.player);
    }
  }, []);

  useEffect(() => {
    const totalPoints = dicePointsTotal.reduce((acc, curr) => acc + curr, 0);
    setTotalPoints(totalPoints);

    if (totalPoints >= BONUS_POINTS_LIMIT) {
        setRemainingPointsToBonus(0);
    } else {
        setRemainingPointsToBonus(BONUS_POINTS_LIMIT - totalPoints);
    }
}, [dicePointsTotal]);

  useEffect(() => {
    if (nbrOfThrowsLeft === 0 && !assigningPoints) {
      startNewRound();
    }
  }, [nbrOfThrowsLeft, assigningPoints]);

  const throwDices = () => {
    if (nbrOfThrowsLeft > 0 && !assigningPoints) {
        let newSelectedDices = [...selectedDices];
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                board[i] = 'dice-' + randomNumber;
            }
        }
        setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
        setSelectedDices(newSelectedDices);

        // Calculate total points after throwing dices
        const totalPointsAfterThrow = dicePointsTotal.reduce((acc, curr) => acc + curr, 0);
        console.log('Total points after throw:', totalPointsAfterThrow);
        console.log('Remaining points to bonus:', remainingPointsToBonus);
        if (totalPointsAfterThrow >= BONUS_POINTS_LIMIT && remainingPointsToBonus === 0) {
            // Apply bonus points to the total points
            const totalPointsWithBonus = totalPointsAfterThrow + BONUS_POINTS;
            setTotalPoints(totalPointsWithBonus);
            setRemainingPointsToBonus(0); // Reset remaining points to bonus
            // Save end game score
            saveScore(totalPointsWithBonus, playerName);
            // Navigate to scoreboard if needed
            if (assignedPoints.every(Boolean) && currentRound >= MAX_ROUNDS) {
                navigation.navigate('Scoreboard', { finalScore: totalPointsWithBonus });
            }
        }
    }
};


  const startNewRound = () => {
    setNbrOfThrowsLeft(NBR_OF_THROWS);
    setCurrentRound(currentRound + 1);
    setAssigningPoints(true);
  };

  const assignPoints = (index) => {
    if (!assignedPoints[index] && selectedDices.some(dice => dice)) {
      let points = 0;
      for (let i = 0; i < NBR_OF_DICES; i++) {
        if (selectedDices[i] && parseInt(board[i].split('-')[1]) === index + 1) {
          points += index + 1;
        }
      }
      let updatedPoints = [...dicePointsTotal];
      updatedPoints[index] += points;
      setDicePointsTotal(updatedPoints);
      let updatedAssignedPoints = [...assignedPoints];
      updatedAssignedPoints[index] = true;
      setAssignedPoints(updatedAssignedPoints);
      setAssigningPoints(false);
      setSelectedDices(new Array(NBR_OF_DICES).fill(false)); // Reset selected dices
  
      // Save end game score
      saveScore(totalPoints, playerName);
    }
  };

  const toggleDiceSelection = (index) => {
    let newSelectedDices = [...selectedDices];
    newSelectedDices[index] = !newSelectedDices[index];
    setSelectedDices(newSelectedDices);
  };

  const Dice = ({ index }) => {
    return (
      <Pressable onPress={() => toggleDiceSelection(index)}>
        <MaterialCommunityIcons
          name={board[index]}
          size={50}
          color={selectedDices[index] ? "black" : "steelblue"}
        />
      </Pressable>
    );
  };

  const PointsSpot = ({ index }) => {
    return (
      <Pressable onPress={() => assignPoints(index)}>
        <Text style={styles.pointsSpot}>{dicePointsTotal[index]}</Text>
      </Pressable>
    );
  };

  const DicesRow = () => {
    const dicesRow = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
      dicesRow.push(<Col key={`dice_col_${i}`}><Dice index={i} /></Col>);
    }
    return dicesRow;
  };

  const PointsRow = () => {
    const pointsRow = [];
    for (let i = MIN_SPOT; i <= MAX_SPOT; i++) {
      pointsRow.push(
        <Col key={`spot_col_${i}`} >
          <PointsSpot index={i - 1} />
        </Col>
      );
    }
    return pointsRow;
  };


  const SCOREBOARD_SIZE = 7;
const saveScore = async (totalScore, scoreTime) => {
    try {
        // Retrieve existing scores
        const scoreboardData = await AsyncStorage.getItem('scoreboard');
        let scoreboard = [];
        if (scoreboardData !== null) {
            scoreboard = JSON.parse(scoreboardData);
        }

        // Add new score only when all spots are assigned
        if (assignedPoints.every(Boolean)) {
            const newScoreboardEntry = { playerName, totalScore };
            scoreboard.push(newScoreboardEntry);
            scoreboard.sort((a, b) => b.totalScore - a.totalScore);
            const updatedScoreboard = scoreboard.slice(0, SCOREBOARD_SIZE);
            await AsyncStorage.setItem('scoreboard', JSON.stringify(updatedScoreboard));
            console.log(updatedScoreboard);
        }
    } catch (error) {
        console.error('Error saving score:', error);
    }
};


  const startNewGame = async () => {
    try {
    await saveScore(totalPoints);

    setNbrOfThrowsLeft(NBR_OF_THROWS);
    setSelectedDices(new Array(NBR_OF_DICES).fill(false));
    setDicePointsTotal(new Array(MAX_SPOT).fill(0));
    setAssignedPoints(new Array(MAX_SPOT).fill(false));
    setTotalPoints(0);
    setCurrentRound(1);
    setAssigningPoints(false);
    setRemainingPointsToBonus(BONUS_POINTS_LIMIT);
    board = [];
    navigation.navigate('Scoreboard', { finalScore: totalPoints });
  } catch (error) {
    console.error('Error starting new game:', error);
  }
  };

  return (
    <>
      <Header />
      <View>
        <Container fluid>
          <Row>{DicesRow()}</Row>
        </Container>
        <Container fluid >
          <Row style={styles.pointsRow}>{PointsRow()}</Row>
        </Container>
        <View style={styles.pointNumbers}>
        <Text>1</Text>
        <Text>2</Text>
        <Text>3</Text>
        <Text>4</Text>
        <Text>5</Text>
        <Text>6</Text>
        </View>
        <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
        <Text style={styles.gameinfo}>Total Points: {totalPoints}</Text>
        <Text style={styles.gameinfo}>Points to bonus: {remainingPointsToBonus}</Text>
        {assigningPoints ? (
          <Text style={styles.gameinfo}>Assign points</Text>
        ) : (
          <>
            <Text style={styles.gameinfo}>Save points to start new round</Text>
            {currentRound <= MAX_ROUNDS &&
              <Pressable style={styles.playButton} onPress={throwDices}>
                <Text style={styles.buttonText}>Throw Dices</Text>
              </Pressable>
            }
          </>
        )}
        {assignedPoints.every(Boolean) &&
          <Pressable style={styles.playButton} onPress={startNewGame}>
            <Text style={styles.buttonText}>Save Points</Text>
          </Pressable>
        }
      </View>
      <Text style={styles.rules}>Player: {playerName}</Text>
      <Footer />
    </>
  );
};

export default Gameboard;
