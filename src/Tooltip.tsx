import React, { cloneElement, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  arrow,
  FloatingArrow,
  Placement,
  useFloating,
  useHover,
  useInteractions
} from "@floating-ui/react";

import failOnConsole from "jest-fail-on-console";

failOnConsole();

type TooltipProps = {
  text: JSX.Element | string;
  placement?: Placement;
  children: JSX.Element;
  onVisibleChange?: (state: boolean) => void;
  delay?: number;
};

export const Tooltip = ({
  text,
  placement = "top",
  //onVisibleChange,
  children
}: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    //onVisibleChange && onVisibleChange(open);
  };

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange,
    placement,
    middleware: [arrow({ element: arrowRef })]
  });

  const hover = useHover(context, {
    delay: 0,
    move: false
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <div>
      {cloneElement(children, {
        ref: refs.setReference,
        ...getReferenceProps()
      })}
      {isOpen &&
        text &&
        createPortal(
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="tooltip-container"
            {...getFloatingProps()}
          >
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className="tooltip-arrow"
            />
            {text}
          </div>,
          document.body
        )}
    </div>
  );
};

export default Tooltip;