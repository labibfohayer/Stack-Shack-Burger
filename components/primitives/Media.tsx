"use client";

import React from "react";
import clsx from "clsx";

export interface MediaProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
}

export const Media: React.FC<MediaProps> = ({
  src,
  alt = "",
  className,
  loading = "lazy",
  decoding = "async",
  draggable = false,
  ...props
}) => {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      draggable={draggable}
      className={clsx("block", className)}
      {...props}
    />
  );
};

export default Media;
