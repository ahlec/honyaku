import React from "react";
import ReactCrop, { Crop } from "react-image-crop";

import "react-image-crop/dist/ReactCrop.css";

interface ProvidedProps {
  crop: Crop | undefined;
  image: Blob;
  onCropChanged: (crop: Crop) => void;
}

interface ComponentState {
  objectUrl: string;
}

type ComponentProps = ProvidedProps;

export default class ImageCropper extends React.PureComponent<
  ComponentProps,
  ComponentState
> {
  private readonly cropperRef = React.createRef<{
    componentRef: HTMLDivElement | null;
  }>();

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
    const { crop, onCropChanged } = this.props;
    const { objectUrl } = this.state;

    return (
      <ReactCrop
        ref={this.cropperRef as any}
        src={objectUrl}
        crop={crop}
        onChange={onCropChanged}
        minWidth={100}
        minHeight={100}
      />
    );
  }
}
