import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import * as mocks from '~/utils/mocks'
import { PageLink, StoreSettings } from '~/models'
import Footer from '../Footer'

describe('Testing storefront Footer component', () => {
  test('Testing storefront Footer with links', async () => {
    const mockdata: PageLink[] = (
      ((await mocks.getStoreInfo()) as StoreSettings).pageLinks as PageLink[]
    ).map((item) => {
      return {
        title: item.title,
        url: item.url,
        order: item.order,
      }
    })
    render(<Footer pageLinks={mockdata} copyright="test copyright" />, {
      wrapper: MemoryRouter,
    })

    expect(screen.getByText('test copyright')).toBeDefined()
    expect(screen.getByText('About')).toBeDefined()
  })
})
