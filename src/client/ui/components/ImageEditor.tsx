import { IconButton } from "@material-ui/core";
import {
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon
} from "@material-ui/icons";
import { isEqual } from "lodash";
import * as React from "react";
import { Crop } from "react-image-crop";

import ImageCropper from "./ImageCropper";

export interface ImageData {
  image: Blob;
  crop: Crop | undefined;
}

function loadBlobAsImage(blob: Blob): Promise<HTMLImageElement> {
  const img = new Image();
  const objectUrl = window.URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    img.src = objectUrl;
    img.onload = () => resolve(img);
    img.onerror = () => {
      window.URL.revokeObjectURL(objectUrl);
      reject(new Error("An error occurred loading the image."));
    };
  });
}

function getCanvasAsBlob(
  canvas: HTMLCanvasElement,
  type: "image/jpeg" | "image/png"
): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      blob => {
        if (!blob) {
          reject(new Error("Could not convert canvas to blob."));
          return;
        }

        resolve(blob);
      },
      type,
      1
    )
  );
}

async function getCroppedImage(
  { crop, image }: ImageData,
  cropperWidth: number,
  cropperHeight: number,
  maxWidth: number,
  maxHeight: number
): Promise<Blob> {
  if (!crop) {
    return image;
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
    return image;
  }

  const canvas = document.createElement("canvas");
  const img = await loadBlobAsImage(image);

  const scaleX = img.naturalWidth / cropperWidth;
  const scaleY = img.naturalHeight / cropperHeight;

  const ratio = Math.min(maxWidth / cropWidth, maxHeight / cropHeight);
  const outputWidth = cropWidth * ratio;
  const outputHeight = cropHeight * ratio;

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    img,
    cropX * scaleX,
    cropY * scaleY,
    cropWidth * scaleX,
    cropHeight * scaleY,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return getCanvasAsBlob(canvas, "image/jpeg");
}

async function rotateImage90deg(
  blob: Blob,
  direction: "left" | "right"
): Promise<Blob> {
  const image = await loadBlobAsImage(blob);
  const { naturalWidth: width, naturalHeight: height } = image;
  const canvas = document.createElement("canvas");
  canvas.width = height;
  canvas.height = width;

  const theta = (Math.PI / 2) * (direction === "left" ? -1 : 1);

  const context = canvas.getContext("2d")!;
  context.save();
  context.translate(
    Math.abs((width / 2) * Math.cos(theta) + (height / 2) * Math.sin(theta)),
    Math.abs((height / 2) * Math.cos(theta) + (width / 2) * Math.sin(theta))
  );
  context.rotate(theta);
  context.translate(-width / 2, -height / 2);
  context.drawImage(image, 0, 0);
  context.restore();

  return getCanvasAsBlob(canvas, "image/png");
}

interface ComponentProps {
  onChange: (newValue: ImageData) => void;
  value: ImageData | null;
}

export default class ImageEditor extends React.PureComponent<ComponentProps> {
  private readonly cropperRef = React.createRef<any>();

  public getCurrentImage(maxWidth: number, maxHeight: number): Promise<Blob> {
    const { current: cropper } = this.cropperRef;
    if (!cropper) {
      throw new Error("No cropper");
    }

    const { value } = this.props;
    if (!value) {
      throw new Error("No value prop");
    }

    const { height, width } = cropper.clientSize;
    return getCroppedImage(value, width, height, maxWidth, maxHeight);
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
          />
        )}
        <div className="controls">
          File:
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={this.onFileUploaded}
          />
          {value && (
            <React.Fragment>
              <IconButton onClick={this.onRotateLeft}>
                <RotateLeftIcon />
              </IconButton>
              <IconButton onClick={this.onRotateRight}>
                <RotateRightIcon />
              </IconButton>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }

  private onFileUploaded = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files.length) {
      return;
    }

    const newFile = event.target.files[0];
    this.emitChange({
      crop: undefined,
      image: newFile
    });
  };

  private onCropChanged = (crop: Crop) =>
    this.emitChange({
      ...this.props.value!,
      crop
    });

  private onRotateLeft = async () => {
    const { value } = this.props;
    if (!value) {
      return;
    }

    const image = await rotateImage90deg(value.image, "left");
    this.emitChange({
      ...value,
      image
    });
  };

  private onRotateRight = async () => {
    const { value } = this.props;
    if (!value) {
      return;
    }

    const image = await rotateImage90deg(value.image, "right");
    this.emitChange({
      ...value,
      image
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
