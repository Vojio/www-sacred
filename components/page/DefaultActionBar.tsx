'use client';

import styles from '@components/page/DefaultActionBar.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import { toggleDebugGrid } from '@components/DebugGrid';
import { useHotkeys } from '@modules/hotkeys';

import ActionBar from '@components/ActionBar';
import ButtonGroup from '@components/ButtonGroup';

function isElement(target: EventTarget | null): target is Element {
  return target instanceof Element;
}

function isHTMLElement(target: EventTarget | null): target is HTMLElement {
  return target instanceof HTMLElement;
}

const findFocusableParent = (element: Element | null): Element | null => {
  while (element) {
    element = element.parentElement;
    if (element && Utilities.isFocusableElement(element)) {
      return element;
    }
  }
  return null;
};

const findNextFocusableSibling = (element: Element, direction: 'next' | 'previous'): HTMLElement | null => {
  let sibling = direction === 'next' ? element.nextElementSibling : element.previousElementSibling;

  while (sibling) {
    if (Utilities.isFocusableElement(sibling)) {
      return sibling as HTMLElement;
    }

    const focusableDescendant = Utilities.findFocusableDescendant(sibling, null, direction);
    if (focusableDescendant) {
      return focusableDescendant;
    }

    sibling = direction === 'next' ? sibling.nextElementSibling : sibling.previousElementSibling;
  }

  return null;
};

const findNextFocusableAncestor = (element: Element, direction: 'next' | 'previous'): HTMLElement | null => {
  let ancestor = element.parentElement;

  while (ancestor) {
    const nextFocusable = findNextFocusableSibling(ancestor, direction);
    if (nextFocusable) {
      return nextFocusable;
    }
    ancestor = ancestor.parentElement;
  }

  return null;
};

const useGlobalNavigationHotkeys = () => {
  const onHandleSubmit = (event: KeyboardEvent) => {
    const target = event.target;
    if (Utilities.isFocusableElement(target)) {
      event.preventDefault();
      (target as HTMLElement).click();
    }
  };

  const onHandleNextFocus = (event: KeyboardEvent) => {
    const target = event.target;

    if (Utilities.isFocusableElement(target)) {
      event.preventDefault();

      const nextFocusable = Utilities.findNextFocusable(target as Element, 'next');
      if (nextFocusable) {
        nextFocusable.focus();
      }
    }
  };

  const onHandlePreviousFocus = (event: KeyboardEvent) => {
    const target = event.target;

    if (Utilities.isFocusableElement(target)) {
      event.preventDefault();

      const previousFocusable = Utilities.findNextFocusable(target as Element, 'previous');
      if (previousFocusable) {
        previousFocusable.focus();
      }
    }
  };

  useHotkeys('ArrowDown', onHandleNextFocus);
  useHotkeys('ArrowUp', onHandlePreviousFocus);
  useHotkeys('ArrowRight', onHandleNextFocus);
  useHotkeys('ArrowLeft', onHandlePreviousFocus);
  useHotkeys('Enter', onHandleSubmit);
  useHotkeys(' ', onHandleSubmit);
};

interface DefaultActionBarProps {
  items?: {
    hotkey: string;
    onClick: () => void;
    body: React.ReactNode;
    items?: any;
  }[];
}

const DefaultActionBar: React.FC<DefaultActionBarProps> = ({ items = [] }) => {
  const [isGrid, setGrid] = React.useState(false);
  useHotkeys('ctrl+g', () => toggleDebugGrid());

  useGlobalNavigationHotkeys();

  return (
    <div className={styles.root}>
      <ActionBar
        items={[
          {
            hotkey: '⌃+O',
            body: 'Font',
            openHotkey: 'ctrl+o',
            items: [
              {
                icon: '⊹',
                children: 'Departure Mono [MIT] [DEFAULT]',
                onClick: () => Utilities.onHandleFontChange(''),
              },
              {
                icon: '⊹',
                children: 'Geist Mono [OFL]',
                onClick: () => Utilities.onHandleFontChange('font-use-geist-mono'),
              },
              {
                icon: '⊹',
                children: 'Server Mono 0.0.6 [OFL]',
                onClick: () => Utilities.onHandleFontChange('font-use-server-mono'),
              },
              {
                icon: '⊹',
                children: 'TX-02 Berkeley Mono™',
                onClick: () => Utilities.onHandleFontChange('font-use-berkeley-mono'),
              },
            ],
          },
          {
            hotkey: '⌃+T',
            body: 'Theme',
            openHotkey: 'ctrl+t',
            items: [
              {
                icon: '⊹',
                children: 'Pink Bikini [DEFAULT]',
                onClick: () => Utilities.onHandleThemeChange('theme-black-pink'),
              },
              {
                icon: '⊹',
                //This one has dark/light mode
                children: 'Oranges In Wintergarden [AUTO]',
                onClick: () => Utilities.onHandleThemeChange('theme-orange'),
              },
              {
                icon: '⊹',
                children: 'Refined White',
                onClick: () => Utilities.onHandleThemeChange(''),
              },
              {
                icon: '⊹',
                children: 'Black Midnight Vapor',
                onClick: () => Utilities.onHandleThemeChange('theme-dark'),
              },
              {
                icon: '⊹',
                children: 'U-571 Code Red',
                onClick: () => Utilities.onHandleThemeChange('theme-black-red'),
              },
              {
                icon: '⊹',
                children: 'Digital Bioluminescence',
                onClick: () => Utilities.onHandleThemeChange('theme-black-teal'),
              },
              {
                icon: '⊹',
                children: 'Operation Safe Blue',
                onClick: () => Utilities.onHandleThemeChange('theme-blue'),
              },
              {
                icon: '⊹',
                children: 'Neon Green Garden',
                onClick: () => Utilities.onHandleThemeChange('theme-green'),
              },
              {
                icon: '⊹',
                children: 'Kirkland Signature AS/400',
                onClick: () => Utilities.onHandleThemeChange('theme-black-green'),
              },
            ],
          },
          {
            hotkey: '⌃+G',
            onClick: () => {
              toggleDebugGrid();
            },
            body: 'Grid',
            selected: false,
          },
          ...items,
        ]}
      />
    </div>
  );
};

export default DefaultActionBar;
