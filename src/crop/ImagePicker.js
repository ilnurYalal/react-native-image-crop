import ImagePicker from 'react-native-image-picker';
const settings = {
  title: 'Select Avatar',
  maxWidth: 1000,
  maxHeight: 1000,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export const ImagePickerDialog = {
  show(options = {}) {
    return new Promise((resolve, reject) => {
      ImagePicker.showImagePicker(Object.assign(settings, options), (response) => {
        const result = {
          source: null,
          type: null,
          message: '',
        };
        if (response.didCancel) {
          result.type = 'UserCancel';
          result.message = 'User cancelled image picker';
        } else if (response.error) {
          return reject({
            type: 'Error',
            message: response.error,
          });
        } else if (response.customButton) {
        } else {
          console.info(response);
          result.source = {
            uri: `data:image/jpeg;base64,${response.data}`,
            isStatic: true,
          };
        }
        return resolve(result);
      });
    });
  },
};
