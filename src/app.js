import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
  ImageEditor,
  ImageStore
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
type ImageOffset = {
  x: number;
  y: number;
};

type ImageSize = {
  width: number;
  height: number;
};

type ImageCropData = {
  offset: ImageOffset;
  size: ImageSize;
  displaySize?: ?ImageSize;
  resizeMode?: ?any;
};
export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageURI: null,
      imageSize: {
        width: 0,
        height: 0,
      },
      cropFrame: {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      },
    };
    this.toRemoveImage = '';
  }

  onDone = () => {
    const { imageSize, imageURI, cropFrame } = this.state;
    const cropData: ImageCropData = {
      offset: {
        x: imageSize.width / IMAGE_SIZE.width * cropFrame.left,
        y: imageSize.height / IMAGE_SIZE.height * cropFrame.top
      },
      size: {
        width: imageSize.width / IMAGE_SIZE.width * cropFrame.width,
        height: imageSize.height / IMAGE_SIZE.height * cropFrame.height
      }
    };
    ImageEditor.cropImage(imageURI, cropData, (uri) => {
      console.info(uri);
      if (this.toRemoveImage !== '') {
        ImageStore.removeImageForTag(this.toRemoveImage);
        this.toRemoveImage = '';
      }
      Image.getSize(uri, (imageWidth, imageHeight) => {
        this.setState({
          imageSize: {
            width: imageWidth,
            height: imageHeight,
          },
          imageURI: uri,
        });
        this.toRemoveImage = uri;
      });
    },
    (error) => {
      console.info(error);
    });
  };

  onShowImagePicker = () => {
    ImagePickerDialog.show()
    .then(({ source }) => {
      if (source) {
        console.info(source);
        Image.getSize(source.uri, (imageWidth, imageHeight) => {
          this.setState({
            imageURI: source.uri,
            imageSize: {
              width: imageWidth,
              height: imageHeight
            },
          });
        });
      }
    });
  };

  onChangeCropFrame = (top, left, width, height) => {
    this.setState({
      cropFrame: {
        top, left, width, height
      }
    });
  };

  renderCropView = () => {
    const { imageURI } = this.state;
    if (imageURI !== null) {
      return (
        <View style={styles.cropContainer}>
          <Crop
            imageURI={imageURI}
            onChangeCropFrame={this.onChangeCropFrame}
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
