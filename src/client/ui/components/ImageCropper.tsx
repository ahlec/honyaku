import { isEqual } from "lodash";
import memoizeOne from "memoize-one";
import React from "react";
import ReactCrop, { Crop } from "react-image-crop";

import "react-image-crop/dist/ReactCrop.css";

interface ComponentProps {
  crop: Crop | undefined;
  image: File;
  onCropChanged: (crop: Crop) => void;
  rotation: number;
}

interface ComponentState {
  objectUrl: string;
}

function shouldInvertCrop(rotation: number): boolean {
  return !!(rotation % 180);
}

function invertCrop(crop: Crop): Crop {
  return {
    ...crop,
    height: crop.width,
    width: crop.height,
    x: crop.y,
    y: crop.x
  };
}

export default class ImageCropper extends React.PureComponent<
  ComponentProps,
  ComponentState
> {
  private readonly cropperRef = React.createRef<{
    componentRef: HTMLDivElement | null;
  }>();

  private readonly getRotatedCrop = memoizeOne(
    (crop: Crop | undefined, rotation: number): Crop | undefined => {
      if (!crop) {
        return undefined;
      }

      if (!shouldInvertCrop(rotation)) {
        return crop;
      }

      return invertCrop(crop);
    }
  );

  public constructor(props: ComponentProps) {
    super(props);

    this.state = {
      objectUrl: window.URL.createObjectURL(props.image)
    };
  }

  public get clientSize(): { height: number; width: number } {
    const { current: cropper } = this.cropperRef;
    if (!cropper) {
      throw new Error("No element exists.");
    }

    const { componentRef: component } = cropper;
    if (!component) {
      throw new Error("No component exists.");
    }

    return {
      height: component.clientHeight,
      width: component.clientWidth
    };
  }

  public componentDidUpdate({ image: prevImage }: ComponentProps) {
    const { image } = this.props;
    if (image !== prevImage) {
      const { objectUrl: prevObjectUrl } = this.state;
      window.URL.revokeObjectURL(prevObjectUrl);
      this.setState({
        objectUrl: window.URL.createObjectURL(image)
      });
    }
  }

  public render() {
    const { crop, rotation } = this.props;
    const { objectUrl } = this.state;

    return (
      <ReactCrop
        ref={this.cropperRef as any}
        src={objectUrl}
        crop={this.getRotatedCrop(crop, rotation)}
        onChange={this.onCropChanged}
        minWidth={100}
        minHeight={100}
      />
    );
  }

  private onCropChanged = (rotatedCrop: Crop) => {
    const { crop: currentCrop, onCropChanged, rotation } = this.props;

    let normalizedCrop: Crop;
    if (shouldInvertCrop(rotation)) {
      normalizedCrop = invertCrop(rotatedCrop);
    } else {
      normalizedCrop = rotatedCrop;
    }

    if (isEqual(normalizedCrop, currentCrop)) {
      return;
    }

    onCropChanged(normalizedCrop);
  };
}
