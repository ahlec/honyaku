import { isEqual } from "lodash";
import * as React from "react";
import { Crop } from "react-image-crop";

import ImageCropper from "./ImageCropper";

export interface ImageData {
  image: File;

  crop: Crop | undefined;

  rotation: 0 | 90 | 180 | 270;
}

function getCroppedImage(
  { crop, image }: ImageData,
  cropperWidth: number,
  cropperHeight: number
): Promise<Blob> {
  if (!crop) {
    return Promise.resolve(image);
  }

  const { x: cropX, y: cropY, width: cropWidth, height: cropHeight } = crop;
  if (
    typeof cropX === "undefined" ||
    typeof cropY === "undefined" ||
    typeof cropWidth === "undefined" ||
    typeof cropHeight === "undefined" ||
    !isFinite(cropX) ||
    !isFinite(cropY) ||
    !isFinite(cropWidth) ||
    !isFinite(cropHeight)
  ) {
    return Promise.resolve(image);
  }

  const canvas = document.createElement("canvas");
  const img = new Image();
  const objectUrl = window.URL.createObjectURL(image);
  return new Promise((resolve, reject) => {
    img.src = objectUrl;
    img.onload = () => {
      const scaleX = img.naturalWidth / cropperWidth;
      const scaleY = img.naturalHeight / cropperHeight;
      console.log(scaleX, scaleY);

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(
        img,
        cropX * scaleX,
        cropY * scaleY,
        cropWidth * scaleX,
        cropHeight * scaleY,
        0,
        0,
        cropWidth,
        cropHeight
      );

      canvas.toBlob(
        blob => {
          if (!blob) {
            reject(new Error("Could not convert canvas to blob."));
            return;
          }

          resolve(blob);
        },
        "image/jpeg",
        1
      );
    };
    img.onerror = () => {
      window.URL.revokeObjectURL(objectUrl);
      reject(new Error("An error occurred loading the image."));
    };
  });
}

interface ComponentProps {
  onChange: (newValue: ImageData) => void;
  value: ImageData | null;
}

const ROTATIONS: ReadonlyArray<ImageData["rotation"]> = [0, 90, 180, 270];

export default class ImageEditor extends React.PureComponent<ComponentProps> {
  private readonly cropperRef = React.createRef<ImageCropper>();

  public getCurrentImage(): Promise<Blob> {
    const { current: cropper } = this.cropperRef;
    if (!cropper) {
      throw new Error("No cropper");
    }

    const { value } = this.props;
    if (!value) {
      throw new Error("No value prop");
    }

    const { height, width } = cropper.clientSize;
    console.log("h/w>", height, width);
    return getCroppedImage(value, width, height);
  }

  public render() {
    const { value } = this.props;

    return (
      <div className="ImageEditor">
        {value && (
          <ImageCropper
            ref={this.cropperRef}
            image={value.image}
            crop={value.crop}
            onCropChanged={this.onCropChanged}
            rotation={value.rotation}
          />
        )}
        <div className="controls">
          File:
          <input
            type="file"
            accept="image/jpeg"
            onChange={this.onFileUploaded}
          />
          {value && (
            <React.Fragment>
              Rotation:
              <select onChange={this.onRotationChange} value={value.rotation}>
                {ROTATIONS.map(this.renderRotationOption)}
              </select>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }

  private renderRotationOption = (rotation: number) => {
    return (
      <option key={rotation} value={rotation}>
        {rotation}
      </option>
    );
  };

  private onFileUploaded = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files.length) {
      return;
    }

    const newFile = event.target.files[0];
    this.emitChange({
      crop: undefined,
      image: newFile,
      rotation: 0
    });
  };

  private onCropChanged = (crop: Crop) =>
    this.emitChange({
      ...this.props.value!,
      crop
    });

  private onRotationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = this.props;
    if (!value) {
      return;
    }

    this.emitChange({
      ...value,
      rotation: ROTATIONS[event.target.selectedIndex]
    });
  };

  private emitChange(changed: ImageData) {
    const { onChange, value: currentValue } = this.props;
    if (isEqual(currentValue, changed)) {
      return;
    }

    onChange(changed);
  }
}
