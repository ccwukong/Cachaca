import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import Header from '../Header'

describe('Testing storefront header component', () => {
  test('Testing storefront header without logo image', () => {
    const { getByText } = render(
      <Header storeLogo="" storeName="cachaca store" />,
      { wrapper: MemoryRouter },
    )

    expect(getByText('cachaca store')).toBeDefined()
  })
})
