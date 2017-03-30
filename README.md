## react-native-image-crop

```
<Crop
  ref={(ref) => this.cropRef = ref}
  image={uri}
  onCrop={this.handleCrop}
  initialWidth={IMAGE_SIZE.width}
  initialHeight={IMAGE_SIZE.height}
  minWidth={imageSize.width}
  minHeight={imageSize.height}
  postCropWidth={300}
  postCropHeight={480}
/>
```

### Describe Props of Crop component
#### image
  > set the uri for photo we’re cropping
#### initialWidth, initialHeight
  > size of the initial frame 
#### minWidth, minHeight
  > size of the original image dimensions
#### postCropWidth, postCropHeight
  > size to scale the cropped image to
#### onCrop
  > get the uri for crop image
