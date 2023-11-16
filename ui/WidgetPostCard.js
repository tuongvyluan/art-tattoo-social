import { Card } from "./Card";
import { Carousel, CarouselIndicators, CarouselSlide } from "./Carousel";

import { BackgroundImg } from "./BackgroundImg";
import PropTypes from "prop-types";
import { useState } from "react";

export const WidgetPostCard = ({
  children,
  images,
  imageHeight,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  return (
    <Card>
      <div className="relative w-full">
        <Carousel
          next={next}
          previous={previous}
          className="rounded-t-lg overflow-hidden"
          style={{
            height: imageHeight,
          }}
        >
          {images.map((image, index) => (
            <CarouselSlide key={index} index={index} activeIndex={activeIndex}>
              <BackgroundImg
                className="relative w-full bg-center bg-cover bg-fallback"
                image={image}
                height={imageHeight}
              />
            </CarouselSlide>
          ))}
          <CarouselIndicators
            items={images}
            activeIndex={activeIndex}
            onClickHandler={goToIndex}
          />
        </Carousel>
      </div>

      <div className={'p-2 bg-white'}>{children}</div>
    </Card>
  );
};

WidgetPostCard.propTypes = {
  children: PropTypes.node.isRequired,
  images: PropTypes.array.isRequired,
  imageHeight: PropTypes.number.isRequired,
};
