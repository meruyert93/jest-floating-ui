
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import failOnConsole from 'jest-fail-on-console'

import {
  Dropdown,
  DropdownOptionProps,
  // OptionComponentProps,
} from './Dropdown';

failOnConsole();

// eslint-disable-next-line testing-library/no-unnecessary-act
const waitForFloating = () => act(async () => {});

const options = [
  { label: 'item1', value: 'item1' },
  { label: 'item2', value: 'item2' },
  { label: 'item3', value: 'item3' },
  { label: 'item4', value: 'item4' },
  { label: 'item5', value: 'item5' },
];

jest.mock('@tanstack/react-virtual');
const useVirtualizerMock = jest.mocked(useVirtualizer);


describe('Dropdown', () => {
  
  beforeAll(() => {
    // It is necessary to mock ResizeObserver in jsdom
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    

  });
  
  it('should display dropdown', () => {
    
      useVirtualizerMock.mockReturnValue({
      getVirtualItems: jest.fn().mockReturnValue([
        {
          end: 20,
          index: 0,
          key: 0,
          lane: 0,
          size: 20,
          start: 0,
        },
        {
          end: 40,
          index: 1,
          key: 1,
          lane: 0,
          size: 20,
          start: 20,
        },
        {
          end: 60,
          index: 2,
          key: 2,
          lane: 0,
          size: 20,
          start: 40,
        },
        {
          end: 80,
          index: 3,
          key: 3,
          lane: 0,
          size: 20,
          start: 60,
        },
        {
          end: 100,
          index: 4,
          key: 4,
          lane: 0,
          size: 20,
          start: 80,
        },
      ]),
      getTotalSize: jest.fn(),
    } as any);
  
    render(
      <Dropdown
        options={options}
        isLoading={false}
        testIdPrefix='dropdown'
        onSelect={jest.fn()}
      />,
    );

    expect(screen.getByTestId('dropdown-trigger-button')).toBeInTheDocument();
  });

  it('should render custom trigger element if one is provided', () => {
    const mockOnGetTotalSize = jest.fn();
    useVirtualizerMock.mockReturnValue({
      getVirtualItems: jest.fn().mockReturnValue([]),
      getTotalSize: mockOnGetTotalSize,
    } as any);

    const triggerBtn = <span>Dropdown Trigger</span>;
    const mockOptions: DropdownOptionProps[] = [];

    render(
      <Dropdown
        scrollHeight={100}
        options={mockOptions}
        estimateSize={() => 20}
        isLoading={false}
        testIdPrefix='dropdown'
        triggerElement={triggerBtn}
        onSelect={jest.fn()}
      />,
    );
    expect(
      screen.queryByTestId('dropdown-trigger-div'),
    ).not.toBeInTheDocument();

    expect(screen.getByText('Dropdown Trigger')).toBeInTheDocument();
  });
});
