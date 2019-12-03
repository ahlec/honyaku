import { Slider } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { clamp, isEqual } from "lodash";
import * as React from "react";
import AvatarEditor from "react-avatar-editor";

export interface ImageData {
  image: File;

  /**
   * The native width of the image. This is immutable and doesn't change
   * unless the image does.
   */
  naturalWidth: number;

  /**
   * The native height of the image. This is immutable and doesn't change
   * unless the image does.
   */
  naturalHeight: number;

  /**
   * Center position of the image on the scale of [0,1].
   */
  centerX: number;

  /**
   * Center position of the image on the scale of [0,1].
   */
  centerY: number;

  width: number;
  height: number;
  scale: number;
  rotation: 0 | 90 | 180 | 270;
}

const MIN_SCALE = 0.01;
const MAX_SCALE = 10;

const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;

const PrettySlider = withStyles({
  root: {
    color: "#52af77",
    height: 8
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus,&:hover,&$active": {
      boxShadow: "inherit"
    }
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)"
  },
  track: {
    height: 8,
    borderRadius: 4
  },
  rail: {
    height: 8,
    borderRadius: 4
  }
})(Slider);

export function measureFileDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  const img = new Image();
  const objectUrl = window.URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    img.src = objectUrl;
    img.onload = () => {
      const measurements = {
        width: img.naturalWidth,
        height: img.naturalHeight
      };

      window.URL.revokeObjectURL(objectUrl);

      resolve(measurements);
    };

    img.onerror = () => {
      window.URL.revokeObjectURL(objectUrl);

      reject(new Error("An error occurred loading the image."));
    };
  });
}

export async function getImageDataFromUrl(url: string): Promise<ImageData> {
  const result = await fetch(url);
  const x = await result.blob();
  const file = new File([x], "icon.jpg");
  const { width, height } = await measureFileDimensions(file);
  return {
    centerX: 0.5,
    centerY: 0.5,
    image: file,
    rotation: 0,
    scale: 1,
    width,
    height,
    naturalWidth: width,
    naturalHeight: height
  };
}

interface ComponentProps {
  onChange: (newValue: ImageData) => void;
  value: ImageData | null;
}

const ROTATIONS: ReadonlyArray<ImageData["rotation"]> = [0, 90, 180, 270];

export default class ImageEditor extends React.PureComponent<ComponentProps> {
  private readonly avatarEditorRef = React.createRef<AvatarEditor>();

  public getCurrentImage(): Promise<Blob> {
    const { current: avatarEditor } = this.avatarEditorRef;
    if (!avatarEditor) {
      throw new Error("AvatarEditor does not exist");
    }

    const canvas = avatarEditor.getImageScaledToCanvas();
    return new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error("Received null when converting to blob."));
          return;
        }

        resolve(blob);
      })
    );
  }

  public render() {
    const { value } = this.props;

    return (
      <div className="ImageEditor">
        {value && (
          <AvatarEditor
            ref={this.avatarEditorRef}
            image={value.image}
            width={value.width}
            height={value.height}
            position={{
              x: value.centerX,
              y: value.centerY
            }}
            rotate={value.rotation}
            scale={value.scale}
            onPositionChange={this.onPositionChange}
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
              Scale:
              <input
                type="number"
                value={value.scale}
                min={MIN_SCALE}
                max={MAX_SCALE}
                step={0.05}
                onChange={this.onScaleChange}
              />
              Rotation:
              <select onChange={this.onRotationChange} value={value.rotation}>
                {ROTATIONS.map(this.renderRotationOption)}
              </select>
              Width:
              <PrettySlider
                min={MIN_WIDTH}
                max={value.naturalWidth}
                onChange={this.onWidthChange}
                value={value.width}
              />
              Height:
              <PrettySlider
                min={MIN_HEIGHT}
                max={value.naturalHeight}
                onChange={this.onHeightChange}
                value={value.height}
              />
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

  private onFileUploaded = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || !event.target.files.length) {
      return;
    }

    const newFile = event.target.files[0];
    const { width, height } = await measureFileDimensions(newFile);
    this.emitChange({
      centerX: 0.5,
      centerY: 0.5,
      image: newFile,
      rotation: 0,
      scale: 1,
      width,
      height,
      naturalWidth: width,
      naturalHeight: height
    });
  };

  private onPositionChange = (center: { x: number; y: number }) =>
    this.emitChange({
      ...this.props.value!,
      centerX: center.x,
      centerY: center.y
    });

  private onScaleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.emitChange({
      ...this.props.value!,
      scale: clamp(parseFloat(event.target.value), MIN_SCALE, MAX_SCALE)
    });

  private onRotationChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    this.emitChange({
      ...this.props.value!,
      rotation: ROTATIONS[event.target.selectedIndex]
    });

  private onWidthChange = (event: React.MouseEvent, value: number) =>
    this.emitChange({
      ...this.props.value!,
      width: Math.max(value, MIN_WIDTH)
    });

  private onHeightChange = (event: React.MouseEvent, value: number) =>
    this.emitChange({
      ...this.props.value!,
      height: Math.max(value, MIN_WIDTH)
    });

  private emitChange(changed: ImageData) {
    const { onChange, value: currentValue } = this.props;
    if (isEqual(currentValue, changed)) {
      return;
    }

    onChange(changed);
  }
}
