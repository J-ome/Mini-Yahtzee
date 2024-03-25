import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Button, Alert, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../style/style';

const Scoreboard = () => {
    const [scoreboard, setScoreboard] = useState([]);

    const fetchAndUpdateScoreboard = async () => {
        try {
            const scoreboardData = await AsyncStorage.getItem('scoreboard');
            if (scoreboardData) {
                const parsedScores = JSON.parse(scoreboardData);
                setScoreboard(parsedScores);
            } else {
                setScoreboard([]);
            }
        } catch (error) {
            console.error('Error fetching scores:', error);
            Alert.alert('Error', 'Failed to fetch scoreboard. Please try again later.');
        }
    };

    useEffect(() => {
        fetchAndUpdateScoreboard();
    }, []);

    useFocusEffect(() => {
        fetchAndUpdateScoreboard();
    });

    const clearScoreboard = async () => {
        try {
            await AsyncStorage.removeItem('scoreboard');
            setScoreboard([]);
        } catch (error) {
            console.error('Error clearing scoreboard:', error);
            Alert.alert('Error', 'Failed to clear scoreboard. Please try again later.');
        }
    };

    const renderItem = ({ item }) => (
        <View>
            <Text>{item.playerName}: {item.totalScore}</Text>
        </View>
    );

    return (
        <View>
            <Text style={styles.rulesHeader}>Scoreboard</Text>
            <View style={styles.scoreboardBorder}>
            <FlatList
                style={styles.scoreboard}
                data={scoreboard}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            </View>
            <Pressable style={styles.playButton}
              onPress={() => clearScoreboard()}>
              <Text style={styles.clearScoreboard}>Clear Scoreboard</Text>
            </Pressable>

        </View>
    );
};

export default Scoreboard;
