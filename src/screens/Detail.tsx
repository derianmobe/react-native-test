import {
  Alert,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import CustomImage from '../components/CustomImage';
import RNFetchBlob from 'rn-fetch-blob';
import React from 'react';

type Props = {
  route: any;
};

const DetailScreen = ({route}: Props) => {
  const {photo} = route.params;

  const checkPermission = async (url: string) => {
    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission

    if (Platform.OS === 'ios') {
      downloadImage(url);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download Photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          console.log('Storage Permission Granted.');
          downloadImage(url);
        } else {
          // If permission denied then show alert
          Alert.alert('Information', 'Permission for download', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }
    }
  };

  const downloadImage = (url: string) => {
    // Main function to download the image

    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = url;
    // Getting the extention of the file
    let ext = getExtention(image_URL)?.toString();
    if (ext) {
      ext = '.' + ext[0];
    }
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext +
          '.png',
        description: 'Image',
      },
      path:
        PictureDir +
        '/image_' +
        Math.floor(date.getTime() + date.getSeconds() / 2) +
        ext +
        '.png',
    };

    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        // Showing alert after successful downloading
        console.log('In this location the image was saved ', res.data);
        Alert.alert('Information', 'Image Downloaded Successfully.', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        // alert('Image Downloaded Successfully.');
      })
      .catch(e => {
        console.log('ERROR: ', e);
      });
  };

  const getExtention = (filename: string) => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  return (
    <View style={styles.mainContainer}>
      <CustomImage url={photo.detailImage} height={300} width={300} />
      <View style={styles.textContainer}>
        <Text>Description: {photo.alt}</Text>
        <Text>User: {photo.user}</Text>
        <Text>Likes: {photo.likes}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={() => checkPermission(photo.detailImage)}>
          <Text>Download image</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ADC4CE',
  },
  textContainer: {
    marginTop: 20,
    marginLeft: 15,
  },
  buttonContainer: {
    marginLeft: 15,
    marginTop: 20,
    marginRight: 15,

    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

export default DetailScreen;
