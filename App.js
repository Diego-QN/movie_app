import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão não concedida, permita sua localização.');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const handleSearch = async () => {
    if (movieTitle.trim() === '') {
      Alert.alert('Filme não encontrado.');
      return;
    }
    try {
      const apiKey = 'f478b5b7';
      const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        Alert.alert('Filme não encontrado.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'tente novamente mais tarde!');
    }
  };

  return (
    <View>
      <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 20 }}>
        Busca de Filmes
      </Text>
      <TextInput
        style={{ borderWidth: 1, margin: 10, padding: 8 }}
        placeholder="Nome do filme"
        value={movieTitle}
        onChangeText={(text) => setMovieTitle(text)}
      />
      <Button title="Buscar Filme" onPress={handleSearch} />

      {location && (
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Sua Localização</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <MapView
            style={{ width: '100%', height: 200 }}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: -8.05428,
              longitudeDelta: -34.8813,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Sua Localização"
            />
          </MapView>
        </View>
      )}

      {movieData && (
        <View style={{ margin: 20 }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{movieData.Title}</Text>
          <Text>Ano: {movieData.Year}</Text>
          <Text>Gênero: {movieData.Genre}</Text>
          <Text>Diretor: {movieData.Director}</Text>
          <Text>Prêmios: {movieData.Awards}</Text>
        </View>
      )}
    </View>
  );
};

export default App;