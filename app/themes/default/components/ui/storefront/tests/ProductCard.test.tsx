import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import StoreContext from '~/contexts/storeContext'
import { CategoryItem, StoreSettings } from '~/types'
import * as mocks from '~/utils/mocks'
import ProductCard from '../ProductCard'

describe('ProductCard component', () => {
  test('Testing ProductCard component rendering', async () => {
    const user = userEvent.setup()

    const mockCategories: CategoryItem[] = (
      (await mocks.getCategories()) as CategoryItem[]
    ).map((item) => {
      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        parentId: null,
      }
    })

    const mockProductCard: {
      id: string
      coverImage: string
      title: string
      link: string
      price: string
      onClick: () => void
    } = {
      id: '123',
      link: '/test-product',
      coverImage: 'https://XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      title: 'test product',
      price: '$10',
      onClick: jest.fn(),
    }

    render(
      <StoreContext.Provider
        value={{
          storeSettings: (await mocks.getStoreInfo()) as StoreSettings,
          categories: mockCategories,
          publicPages: [],
        }}
      >
        <ProductCard {...mockProductCard} />
      </StoreContext.Provider>,
      { wrapper: MemoryRouter },
    )

    expect(screen.getByText('test product')).toBeDefined()
    expect(screen.getByText('$10')).toBeDefined()

    await user.click(await screen.findByText('system.add_cart'))
    expect(mockProductCard.onClick).toHaveBeenCalledTimes(1)
  })
})
