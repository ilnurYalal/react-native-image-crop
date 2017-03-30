import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { ImagePickerDialog } from './crop/ImagePicker';
import Crop from './crop';
const { width, height } = Dimensions.get('window');

const WINDOW_WIDTH = width;
const WINDOW_HEIGHT = height;
const IMAGE_SIZE = {
  width: WINDOW_WIDTH - 40,
  height: WINDOW_HEIGHT - 150
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  headerContainer: {
    height: 40,
    width: width - 10,
    justifyContent: 'center',
    marginTop: 20,
    marginRight: 10,
    flexDirection: 'row'
  },
  openPhotoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.1
  },
  doneContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.1
  },
  cropContainer: {
    flex: 1,
    // backgroundColor: 'orange'
  }
});

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: null,
      imageSize: {
        width: 0,
        height: 0,
      },
    };
    this.cropRef = null;
  }

  onShowImagePicker = () => {
    ImagePickerDialog.show()
    .then(({ source }) => {
      if (source) {
        console.info(source);
        Image.getSize(source.uri, (imageWidth, imageHeight) => {
          if (imageWidth < 500 && imageHeight < 500) {
            alert('please select the large image, min size is 500*500');
            return;
          }
          this.setState({
            uri: source.uri,
            imageSize: {
              width: imageWidth,
              height: imageHeight
            },
          });
        });
      }
    });
  };

  onDone = () => {
    this.cropRef.onCrop();
  };

  handleCrop = (uri) => {
    this.setState({ uri });
  };

  renderCropView = () => {
    const { uri, imageSize } = this.state;
    if (uri !== null) {
      return (
        <View style={styles.cropContainer}>
          <Crop
            ref={(ref) => this.cropRef = ref}
            image={uri}
            onCrop={this.handleCrop}
            initialWidth=
              {imageSize.width === 500 && IMAGE_SIZE.width < 250 ? 250 : IMAGE_SIZE.width }
            initialHeight=
              {imageSize.height === 500 && IMAGE_SIZE.height < 250 ? 250 : IMAGE_SIZE.height}
            minWidth={imageSize.width}
            minHeight={imageSize.height}
            // postCropWidth={300}
            // postCropHeight={480}
          />
        </View>
      );
    }
    return null;
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.openPhotoContainer} onPress={this.onShowImagePicker}>
            <Text>
              Open Photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.doneContainer} onPress={this.onDone}>
            <Text>
              Done
            </Text>
          </TouchableOpacity>
        </View>
        {this.renderCropView()}
      </View>
    );
  }
}
