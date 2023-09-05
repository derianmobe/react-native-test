import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {COLORS, ORIENTATION} from '../constants/dropdownData';
import React, {useEffect, useState} from 'react';

import CustomImage from '../components/CustomImage';
import CustomSelect from '../components/CustomSelect';
import {Photos} from '../interfaces/photos';
import axios from 'axios';
import {isEmpty} from 'lodash';
import useDebounce from '../hooks/useDebounce';

type Props = {
  navigation: any;
};

const HomeScreen = ({navigation}: Props) => {
  const [query, setQuery] = useState('');
  const [photos, setPhotos] = useState<Photos[]>([]);
  const [page, setPage] = useState(1);
  const [colorFilter, setColorFilter] = useState('');
  const [orientationFilter, setOrientationFilter] = useState('');

  const debounceSearch = useDebounce(query, 2000);

  useEffect(() => {
    const getImages = async () => {
      try {
        let response;
        if (!isEmpty(colorFilter) && !isEmpty(orientationFilter)) {
          response = await axios.get(
            `https://api.unsplash.com/search/photos?page=${page}&color=${colorFilter}&orientation=${orientationFilter}&query=${debounceSearch}&client_id=irRhYy7mrqjeD7pf7MkjQ6NYQ-JJBEDQalVUdnl47sw`,
          );
        } else if (!isEmpty(colorFilter)) {
          response = await axios.get(
            `https://api.unsplash.com/search/photos?page=${page}&color=${colorFilter}&query=${debounceSearch}&client_id=irRhYy7mrqjeD7pf7MkjQ6NYQ-JJBEDQalVUdnl47sw`,
          );
        } else if (!isEmpty(orientationFilter)) {
          response = await axios.get(
            `https://api.unsplash.com/search/photos?page=${page}}&orientation=${orientationFilter}&query=${debounceSearch}&client_id=irRhYy7mrqjeD7pf7MkjQ6NYQ-JJBEDQalVUdnl47sw`,
          );
        } else {
          response = await axios.get(
            `https://api.unsplash.com/search/photos?page=${page}&query=${debounceSearch}&client_id=irRhYy7mrqjeD7pf7MkjQ6NYQ-JJBEDQalVUdnl47sw`,
          );
        }
        const newPhotos = response.data.results.map((image: any) => ({
          id: image.id,
          url: image.urls.thumb,
          alt: image.alt_description,
          detailImage: image.urls.small,
          likes: image.likes,
          user: image.user.username,
        }));

        const isFilter = !isEmpty(colorFilter) || !isEmpty(orientationFilter);
        if (isFilter) {
          setPhotos(newPhotos);
        }

        setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
      } catch (e) {
        console.log(e);
      }
    };

    if (debounceSearch) {
      getImages();
    }
  }, [debounceSearch, colorFilter, orientationFilter, page]);

  const search = (newQuery: string) => {
    setQuery(newQuery);
    setPhotos([]);
    setPage(1);
  };

  const renderContent = () => {
    if (isEmpty(debounceSearch) && !isEmpty(query)) {
      return (
        <View style={styles.textContainer}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      );
    } else if (isEmpty(query)) {
      return (
        <View style={styles.textContainer}>
          <Text>Search some image...</Text>
        </View>
      );
    } else if (!isEmpty(query) && isEmpty(photos)) {
      return (
        <View style={styles.textContainer}>
          <Text>We don't have results for your search</Text>
        </View>
      );
    } else {
      return (
        <FlatList
          contentContainerStyle={styles.flatListContainer}
          data={photos}
          renderItem={({item}) => {
            return (
              <Pressable
                onPress={() => {
                  navigation.navigate('Detail', {photo: item});
                  setQuery('');
                }}>
                <View key={item.id} style={styles.container}>
                  <CustomImage url={item.url} height={200} width={200} />
                </View>
              </Pressable>
            );
          }}
          keyExtractor={item => item.id}
          onEndReached={() => setPage(page + 1)}
        />
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <TextInput
        placeholder="Search an image"
        style={styles.input}
        onChangeText={search}
        value={query}
      />
      <View style={styles.dropdownContainer}>
        <View style={styles.container}>
          <Text>Colors</Text>
          <CustomSelect data={COLORS} onChange={setColorFilter} />
        </View>
        <View style={styles.container}>
          <Text>Orientation</Text>
          <CustomSelect data={ORIENTATION} onChange={setOrientationFilter} />
        </View>
      </View>
      <View style={styles.container}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#ADC4CE',
  },
  container: {
    flex: 1,
  },
  image: {
    width: 200,
    height: 200,
    margin: 15,
  },
  dropdownContainer: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
  },
  flatListContainer: {
    flexGrow: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
