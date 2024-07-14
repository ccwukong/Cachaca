import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PageLink, PublicPage, StoreSettings } from '~/types'
import * as mocks from '~/utils/mocks'
import Footer from '../Footer'

describe('Testing storefront Footer component', () => {
  test('Testing storefront Footer with links', async () => {
    const mockdata: PublicPage[] = (
      ((await mocks.getStoreInfo()) as StoreSettings).pageLinks as PageLink[]
    ).map((item) => {
      return {
        name: item.title,
        slug: item.url,
        order: item.order,
        content: '',
      }
    })
    render(<Footer publicPages={mockdata} copyright="test copyright" />, {
      wrapper: MemoryRouter,
    })

    expect(screen.getByText('test copyright')).toBeDefined()
    expect(screen.getByText('About')).toBeDefined()
  })
})
