import {
  autoUpdate,
  offset,
  shift,
  size,
  useFloating,
} from '@floating-ui/react';
import { Menu, Transition } from '@headlessui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
// import classNames from 'classnames';
import {
  ComponentType,
  FocusEventHandler,
  MouseEvent,
  ReactNode,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
// import { RiArrowDownSLine, RiCheckLine } from 'react-icons/ri';

// import { Spinner } from './Spinner';

export type OptionComponentProps<T extends DropdownOptionProps> = {
  option: T;
  onClick: (event: MouseEvent) => void;
  selected?: T['value'];
};

export type DropdownOptionProps = {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
};

export type DropdownProps<T extends DropdownOptionProps> = {
  // switch triggerElement and children
  children?: ReactNode;
  triggerElement?: ReactNode;
  emptyElement?: ReactNode;
  OptionComponent?: ComponentType<OptionComponentProps<T>>;
  testIdPrefix?: string;
  width?: 'match' | 'auto';
  disabled?: boolean;
  onFocus?: FocusEventHandler<HTMLDivElement>;
  options: T[];
  estimateSize?: (option: T, width: number) => number;
  // scroll height of the popper
  scrollHeight?: number;
  isLoading?: boolean;
  onSelect?: (value: T['value'], option: T) => void;
  selected?: T['value'];
};

export function Dropdown<T extends DropdownOptionProps>({
  children,
  triggerElement,
  emptyElement,
  OptionComponent = DropdownOption,
  testIdPrefix,
  width = 'match',
  disabled = false,
  onFocus,
  options,
  scrollHeight = 400,
  estimateSize,
  isLoading = false,
  onSelect,
  selected,
}: DropdownProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const listWidthRef = useRef<number | undefined>();

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
    shift({
      padding: 5, // 0 by default
    }),
      offset(0),
      width === 'match' &&
        size({
          apply({ rects, elements }) {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
            });
          },
        }),
    ],
  });
  
  let estimate;
  const currentWidthRef = listWidthRef.current;

  if (estimateSize && currentWidthRef) {
    estimate = (index: number) => estimateSize(options[index], currentWidthRef);
  } else {
    estimate = () => 36;
  }

  const count = options.length;
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: estimate,
    overscan: 5,
  });

  const items = virtualizer.getVirtualItems();

  const selectedOption = options.find(o => o.value === selected);


  const trigger = triggerElement || (
    <div
      data-testid={`${testIdPrefix}-trigger-div`}
      className='text-left focus:outline-none h-full border-2 px-2 py-1 border-gray-100 rounded-md w-64 flex flex-row justify-end'
    >
      <div className='flex-1 truncate'>{selectedOption?.label}</div>
    </div>
  );
  
    const listElement =
    count > 0 ? (
      <div
        style={{
          height: virtualizer.getTotalSize(),
        }}
        data-testid={`${testIdPrefix}-list`}
      >
        <div
          style={{
            transform: `translateY(${items[0].start}px)`,
          }}
          className='rounded-none rounded-b-md divide-y divide-gray-200'
        >
          {items.map(item => {
            const { index, key } = item;

            return (
              <div
                key={key}
                data-index={index}
                ref={virtualizer.measureElement}
              >
                <OptionComponent
                  selected={selected}
                  option={options[index]}
                  onClick={() =>
                    onSelect && onSelect(options[index].value, options[index])
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    ) : (
      emptyElement || (
        <div className='flex flex-col justify-center items-center align-middle h-full mx-10'>
          <p className='text-gray-400'>No options found</p>
        </div>
      )
    );
  
  // const listElement = options.map(item => {
  //           const { label, value } = item;

  //           return (
  //             <div
  //               key={label}
  //               data-index={value}
  //             >
  //               <OptionComponent
  //                 selected={selected}
  //                 option={item}
  //                 onClick={() =>
  //                   onSelect && onSelect(value, item)
  //                 }
  //               />
  //             </div>
  //           );
  //         })

  return (
    <Menu as='div' className='text-left'>
      {({ open }) => (
        <>
          <div ref={refs.setReference}>
            <Menu.Button
              className='block group focus:outline-none focus-visible:outline-none w-full'
              data-testid={`${testIdPrefix}-trigger-button`}
              disabled={disabled}
            >
              {trigger}
            </Menu.Button>
          </div>

          {createPortal(
            <div ref={refs.setFloating} className='z-50' style={floatingStyles}>
              <Transition
                show={open}
                appear
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
              >
                {
                  <Menu.Items
                    static
                    onFocus={onFocus}
                    className=
                      'rounded-md overflow-hidden shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
                    
                    data-testid={`${testIdPrefix}-menu-items`}
                  >
                    {children}

                    <div
                      ref={parentRef}
                      style={{
                        maxHeight: scrollHeight,
                        overflowY: 'auto',
                      }}
                      data-testid={`${testIdPrefix}-scroll-element`}
                    >
                      {isLoading ? (
                        <div className='flex items-center justify-center py-3'>
                          loading
                        </div>
                      ) : (
                        listElement
                      )}
                    </div>
                  </Menu.Items>
                }
              </Transition>
            </div>,
            document.body,
          )}
        </>
      )}
    </Menu>
  );
}

function DropdownOption({
  option,
  onClick,
  selected,
}: OptionComponentProps<DropdownOptionProps>) {
  const { label, value, disabled } = option;

  const defaultProps = (active: boolean) => {
    return {
      'aria-label': label,
      'data-testid': `dropdown-item-${label}`,
      'aria-checked': selected === value,
      role: 'menuitem',
      className: 'px-3 py-2 w-full block text-left'
    };
  };

  const inner = (
    <>
      <div className='flex'>
        <span
          className='text-sm flex-1'
        >
          {label}
        </span>


      </div>
    </>
  );

  return (
    <Menu.Item>
      {({ active }) => (
        <button
          type='button'
          {...defaultProps(active)}
          onClick={(e: MouseEvent<HTMLButtonElement>) => onClick(e)}
          disabled={disabled}
        >
          {inner}
        </button>
      )}
    </Menu.Item>
  );
}
