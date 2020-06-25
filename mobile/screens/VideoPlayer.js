import React from 'react'
import { StyleSheet, View, Dimensions, Video } from 'react-native';
const VideoPlayer = (props) => {
  return (
    <View style={styles.container}>
      <Video
        source={{
          uri: props.url,
        }}
        style={styles.video}
        controls={true}
        resizeMode={'cover'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * (9 / 16),
    backgroundColor: 'black',
  }
});
export default VideoPlayer;