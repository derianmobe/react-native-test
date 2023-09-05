import {Image, StyleSheet, View} from 'react-native';

import React from 'react';

type Props = {
  url: string;
  height: number;
  width: number;
};

const CustomImage = (props: Props) => {
  return (
    <View style={styles(props).imageContainer}>
      <Image source={{uri: props.url}} style={styles(props).imageStyle} />
    </View>
  );
};

const styles = (props: Props) =>
  StyleSheet.create({
    imageContainer: {
      margin: 10,
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 5,
      height: props.height + 20,
      width: props.width + 20,
    },
    imageStyle: {
      height: props.height,
      width: props.width,
    },
  });

export default CustomImage;
