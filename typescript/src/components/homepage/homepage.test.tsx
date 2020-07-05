import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, fireEvent, waitFor } from 'test-utils';

import Homepage from './homepage';

describe('Home Page', () => {
  test('renders', () => {
    const { container, getByText } = render(<Homepage />);

    expect(container.querySelectorAll('.frog').length).toBe(5);
    expect(container.querySelectorAll('.frog.up').length).toBeFalsy();

    fireEvent.click(getByText('Start'));
  });

  test('should show first frog on start', () => {
    const { container, getByText } = render(<Homepage />);

    fireEvent.click(getByText('Start'));

    expect(container.querySelectorAll('.frog.up').length).toBeTruthy();
    expect(getByText('Score:0')).toBeTruthy();
  });

  test('should hide frog on click and increase count', () => {
    const { container, getByText } = render(<Homepage />);
    fireEvent.click(getByText('Start'));

    fireEvent.click(container.querySelector('.frog.up'));

    expect(container.querySelectorAll('.frog.up').length).toBeFalsy();
    expect(getByText('Score:1')).toBeTruthy();

    waitFor(
      () => {
        expect(container.querySelectorAll('.frog.up').length).toBeTruthy();
      },
      { timeout: 1000 }
    );
  });
});
