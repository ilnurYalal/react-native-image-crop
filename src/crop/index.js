import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  Text,
  ImageEditor,
  ImageStore
} from 'react-native';
const BORDER_WIDTH = 1;
const ACTIVE_BORDER_WIDTH = 2;

type ActiveSide = 'Top' | 'Right' | 'Bottom' | 'Left';

const { width } = Dimensions.get('window');

const WINDOW_WIDTH = width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: '#00f',
    alignItems: 'center'
  },
  image: {
    flexDirection: 'row',
    resizeMode: 'stretch',
  },
  rect: {
    borderWidth: BORDER_WIDTH,
    borderColor: '#3D81FB',
  },
  top: {
    top: -10,
    left: 0,
    right: 0,
    height: 20,
    position: 'absolute',
    /* backgroundColor: 'rgba(0, 255, 0, 0.5)',*/
  },
  right: {
    bottom: 0,
    right: -10,
    top: 0,
    width: 20,
    position: 'absolute',
    /* backgroundColor: 'rgba(0, 255, 0, 0.5)',*/
  },
  bottom: {
    bottom: -10,
    right: 0,
    left: 0,
    height: 20,
    position: 'absolute',
    /* backgroundColor: 'rgba(0, 255, 0, 0.5)',*/
  },
  left: {
    bottom: 0,
    left: -10,
    top: 0,
    width: 20,
    position: 'absolute',
    /* backgroundColor: 'rgba(0, 255, 0, 0.5)',*/
  },
  topRight: {
    top: -13.5,
    right: -12.5,
    height: 26,
    width: 26,
    position: 'absolute',
    overflow: 'hidden',
    /* backgroundColor: 'rgba(0, 255, 0, 0.5)',*/
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRight: {
    bottom: -12.5,
    right: -12.5,
    height: 26,
    width: 26,
    position: 'absolute',
    overflow: 'hidden',
    /* backgroundColor: 'rgba(0, 255, 0, 0.5)',*/
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLeft: {
    bottom: -12.5,
    left: -13.5,
    height: 26,
    width: 26,
    position: 'absolute',
    overflow: 'hidden',
    /* backgroundColor: 'rgba(0, 255, 0, 0.5)',*/
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLeft: {
    top: -13.5,
    left: -13.5,
    height: 26,
    width: 26,
    position: 'absolute',
    overflow: 'hidden',
    /* backgroundColor: 'rgba(0, 255, 0, 0.5)',*/
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#3D81FB',
    backgroundColor: 'white',
  },
  fade: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    position: 'absolute',
  },
  fadeTop: {
    left: 0,
    right: 0,
    top: 0,
  },
  fadeRight: {
    right: 0,
  },
  fadeBottom: {
    left: 0,
    right: 0,
    bottom: 0,
  },
  fadeLeft: {
    left: 0,
  },
  gridRow: {
    position: 'absolute',
    width: 0.5,
    top: 0,
  },
  gridColumn: {
    height: 0.5,
    position: 'absolute',
    left: 0
  },
  actionContainer: {
    marginTop: 20,
    height: 50,
    width: WINDOW_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  originalButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.1
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

export default class Crop extends Component {
  static propTypes = {
    image: PropTypes.string,
    initialWidth: PropTypes.number,
    initialHeight: PropTypes.number,
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    onCrop: PropTypes.func,
    postCropWidth: PropTypes.number,
    postCropHeight: PropTypes.number
  };

  static defaultProps = {
    postCropWidth: 0,
    postCropHeight: 0,
  };

  constructor(props) {
    super(props);
    this.scale = Dimensions.get('window').scale;
    this.state = {
      image: props.image,
      imageWidth: props.initialWidth,
      imageHeight: props.initialHeight,
      responderLocked: false,
      style: {
        top: 20,
        left: 20,
        width: 100,
        height: 100,
        borderTopWidth: BORDER_WIDTH,
        borderRightWidth: BORDER_WIDTH,
        borderBottomWidth: BORDER_WIDTH,
        borderLeftWidth: BORDER_WIDTH,
      },
      originalStyle: {
        top: 20,
        left: 20,
        width: 100,
        height: 100,
        borderTopWidth: BORDER_WIDTH,
        borderRightWidth: BORDER_WIDTH,
        borderBottomWidth: BORDER_WIDTH,
        borderLeftWidth: BORDER_WIDTH,
      },
      initialPosition: {
        top: 20,
        left: 20,
      },
      containerResized: false,
      containerStyle: {
        maxHeight: Dimensions.get('window').height - 52,
        width: Dimensions.get('window').width,
      },
    };
    this.toRemoveImage = '';
  }

  componentWillMount() {
    this.rectPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gs) => !this.state.responderLocked,
      onMoveShouldSetPanResponder: (evt, gs) => !this.state.responderLocked,
      onPanResponderGrant: (evt, gs) => {
        this.setState({
          responderLocked: true,
          style: {
            ...this.state.style,
            borderTopWidth: ACTIVE_BORDER_WIDTH,
            borderRightWidth: ACTIVE_BORDER_WIDTH,
            borderBottomWidth: ACTIVE_BORDER_WIDTH,
            borderLeftWidth: ACTIVE_BORDER_WIDTH,
          },
          initialPosition: {
            top: this.state.style.top,
            left: this.state.style.left,
          },
        });
      },
      onPanResponderMove: (evt, gs) => {
        this.setState({
          style: {
            ...this.state.style,
            top: this.state.initialPosition.top + gs.dy,
            left: this.state.initialPosition.left + gs.dx,
          },
        });
      },
      onPanResponderRelease: (evt, gs) => {
        this.setState({
          responderLocked: false,
          style: {
            ...this.state.style,
            borderTopWidth: BORDER_WIDTH,
            borderRightWidth: BORDER_WIDTH,
            borderBottomWidth: BORDER_WIDTH,
            borderLeftWidth: BORDER_WIDTH,
            top: this.state.initialPosition.top + gs.dy,
            left: this.state.initialPosition.left + gs.dx,
          },
        });
      },
    });

    this.topPanResponder = PanResponder.create({
      ...this.makeResponderHandlers('Top'),
    });

    this.rightPanResponder = PanResponder.create({
      ...this.makeResponderHandlers('Right'),
    });

    this.bottomPanResponder = PanResponder.create({
      ...this.makeResponderHandlers('Bottom'),
    });

    this.leftPanResponder = PanResponder.create({
      ...this.makeResponderHandlers('Left'),
    });

    this.topRightPanResponder = PanResponder.create({
      ...this.makeResponderHandlers('Top', 'Right'),
    });

    this.bottomRightPanResponder = PanResponder.create({
      ...this.makeResponderHandlers('Bottom', 'Right'),
    });

    this.bottomLeftPanResponder = PanResponder.create({
      ...this.makeResponderHandlers('Bottom', 'Left'),
    });

    this.topLeftPanResponder = PanResponder.create({
      ...this.makeResponderHandlers('Top', 'Left'),
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.image !== this.props.image) {
      this.setState({ image: newProps.image });
    }
  }

  onSquare = () => {
    const { style } = this.state;
    let size = style.width;
    let top = style.top;
    let left = style.left;
    if (style.width > style.height) {
      size = style.height;
    }
    if (top + size > this.props.initialHeight) {
      top = this.props.initialHeight - size;
    } else if (top < 0) {
      top = 0;
    }
    if (left < 0) {
      left = 0;
    } else if (left + size > this.props.initialWidth) {
      left = this.props.initialHeight - size;
    }
    this.setState({
      style: {
        ...style,
        width: size,
        height: size,
        top,
        left
      }
    });
  };

  onOriginal = () => {
    this.setState({ style: { ...this.state.originalStyle } });
  };

  adjustSize = (event: Object) => {
    const { containerResized, containerStyle } = this.state;
    if (containerResized) { return; }
    const { height, width, x, y } = event.nativeEvent.layout;
    console.info(height, ' ', width, ' ', x, ' ', y);
    this.setState({
      containerResized: true,
      style: {
        top: height / 4,
        left: width / 4,
        width: width / 2,
        height: width / 2,
      },
      originalStyle: {
        top: height / 4,
        left: width / 4,
        width: width / 2,
        height: width / 2,
      },
      containerStyle: {
        ...containerStyle,
        maxHeight: height,
      },
    });
    // this.props.onChangeCropFrame(height / 4, width / 4, width / 2, height / 2);
  };

  moveTop = (gs) => {
    const nextTop = this.state.initialPosition.top + gs.dy;
    if (nextTop <= 0) { return {}; }
    if (gs.dy < this.state.initialPosition.height) {
      const nextState = {
        height: this.state.initialPosition.height - gs.dy,
        top: nextTop,
      };
      return nextState;
    }
    return ({
      height: gs.dy - this.state.initialPosition.height,
      top: this.state.initialPosition.height + this.state.initialPosition.top
    });
  };

  moveRight = gs => {
    if (gs.dx + this.state.initialPosition.width > 0) {
      return ({
        width: this.state.initialPosition.width + gs.dx,
      });
    }
    return ({
      width: Math.abs(gs.dx) - this.state.initialPosition.width,
      left: this.state.initialPosition.left + this.state.initialPosition.width - Math.abs(gs.dx),
    });
  };

  moveBottom = gs => {
    if (gs.dy + this.state.initialPosition.height > 0) {
      return ({
        height: this.state.initialPosition.height + gs.dy,
      });
    }
    return ({
      height: Math.abs(gs.dy) - this.state.initialPosition.height,
      top: this.state.initialPosition.top + this.state.initialPosition.height - Math.abs(gs.dy)
    });
  };

  moveLeft = gs => {
    if (this.state.initialPosition.width - gs.dx > 0) {
      return ({
        width: this.state.initialPosition.width - gs.dx,
        left: this.state.initialPosition.left + gs.dx,
      });
    }
    console.info('dx~~', gs.dx, 'width~~', this.state.initialPosition.width);
    return ({
      width: gs.dx - this.state.initialPosition.width,
      left: this.state.initialPosition.left + this.state.initialPosition.width
    });
  };

  makeResponderHandlers = (...activeSides: ActiveSide[]) => {
    const activeBordersStyle: Object = {};
    const passiveBordersStyle: Object = {};
    const moveFunctions: string[] = [];
    console.info('activeSides~~', activeSides);
    activeSides.forEach((side) => {
      activeBordersStyle[`border${side}Width`] = ACTIVE_BORDER_WIDTH;
      passiveBordersStyle[`border${side}Width`] = BORDER_WIDTH;
      moveFunctions.push(`move${side}`);
    });

    return {
      onStartShouldSetPanResponder: (evt, gs) => true,
      onMoveShouldSetPanResponder: (evt, gs) => true,
      onPanResponderGrant: (evt, gs) => {
        this.setState({
          responderLocked: true,
          style: {
            ...this.state.style,
            ...activeBordersStyle,
          },
          initialPosition: {
            ...this.state.style,
          },
        });
      },
      onPanResponderMove: (evt, gs) => {
        let moveStyles: Object = {};

        moveFunctions.forEach((fn) => {
          moveStyles = {
            ...moveStyles,
            ...this[fn](gs),
          };
        });

        this.setState({
          style: {
            ...this.state.style,
            ...moveStyles,
          },
        });
      },
      onPanResponderRelease: (evt, gs) => {
        let moveStyles: Object = {};

        moveFunctions.forEach((fn) => {
          moveStyles = {
            ...moveStyles,
            ...this[fn](gs),
          };
        });

        this.setState({
          responderLocked: false,
          style: {
            ...this.state.style,
            ...passiveBordersStyle,
            ...moveStyles,
          },
        });
      },
    };
  };

  onCrop = () => {
    const cropData: ImageCropData = {
      offset: {
        x: this.props.minWidth / this.props.initialWidth * this.state.style.left,
        y: this.props.minHeight / this.props.initialHeight * this.state.style.top
      },
      size: {
        width: this.props.minWidth / this.props.initialWidth * this.state.style.width,
        height: this.props.minHeight / this.props.initialHeight * this.state.style.height
      },
      // displaySize: {
      //   width: this.props.postCropWidth,
      //   height: this.props.postCropHeight,
      // }
    };
    if (this.props.postCropWidth !== 0 && this.props.postCropHeight !== 0) {
      cropData.displaySize = {
        width: this.props.postCropWidth,
        height: this.props.postCropHeight,
      };
    }
    ImageEditor.cropImage(this.props.image, cropData, (uri) => {
      console.info(uri);
      if (this.toRemoveImage !== '') {
        ImageStore.removeImageForTag(this.toRemoveImage);
        this.toRemoveImage = '';
      }
      Image.getSize(uri, (imageWidth, imageHeight) => {
        debugger;
        this.props.onCrop(uri);
        // this.setState({ imageWidth, imageHeight });
        this.toRemoveImage = uri;
      });
    },
      (error) => {
        console.info(error);
      });
  };

  render() {
    const { image, imageWidth, imageHeight } = this.state;
    const backgroundColor = this.state.responderLocked ? 'white' : 'transparent';
    return (
      <View style={[styles.container, this.state.containerStyle]}>
        <Image
          source={{ uri: image }}
          // source={require('img/img_background.jpg')}
          style={[styles.image,
            { width: imageWidth, height: imageHeight }]}
          onLayout={this.adjustSize}
        >
          <View style={[styles.fade, styles.fadeTop, { height: this.state.style.top }]} />
          <View
            style={[styles.fade, styles.fadeRight, {
              left: this.state.style.left + this.state.style.width,
              top: this.state.style.top,
              height: this.state.style.height,
            }]}
          />
          <View
            style={[styles.fade, styles.fadeBottom, {
              height: this.state.containerStyle.maxHeight -
              this.state.style.top - this.state.style.height,
            }]}
          />
          <View
            style={[styles.fade, styles.fadeLeft, {
              width: this.state.style.left,
              top: this.state.style.top,
              height: this.state.style.height,
            }]}
          />
          <View
            style={[styles.rect, this.state.style]}
            {...this.rectPanResponder.panHandlers}
          >
            <View style={styles.top} {...this.topPanResponder.panHandlers} />
            <View style={styles.right} {...this.rightPanResponder.panHandlers} />
            <View style={styles.bottom} {...this.bottomPanResponder.panHandlers} />
            <View style={styles.left} {...this.leftPanResponder.panHandlers} />
            <View style={styles.topRight} {...this.topRightPanResponder.panHandlers}>
              <View style={styles.cornerDot} />
            </View>
            <View style={styles.bottomRight} {...this.bottomRightPanResponder.panHandlers}>
              <View style={styles.cornerDot} />
            </View>
            <View style={styles.bottomLeft} {...this.bottomLeftPanResponder.panHandlers}>
              <View style={styles.cornerDot} />
            </View>
            <View style={styles.topLeft} {...this.topLeftPanResponder.panHandlers}>
              <View style={styles.cornerDot} />
            </View>
            <View style={[styles.gridRow, {
              height: this.state.style.height,
              left: this.state.style.width / 3,
              backgroundColor
            }]}
            />
            <View style={[styles.gridRow, {
              height: this.state.style.height,
              left: this.state.style.width / 3 * 2,
              backgroundColor
            }]}
            />
            <View style={[styles.gridColumn, {
              width: this.state.style.width,
              top: this.state.style.height / 3,
              backgroundColor
            }]}
            />
            <View style={[styles.gridColumn, {
              width: this.state.style.width,
              top: this.state.style.height / 3 * 2,
              backgroundColor
            }]}
            />
          </View>
        </Image>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.originalButton} onPress={this.onOriginal}>
            <Text>
              Original
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.originalButton} onPress={this.onSquare}>
            <Text>
              Square
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
