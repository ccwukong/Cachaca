import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import StoreContext from '~/contexts/storeContext'
import Home from '~/themes/default/pages/storefront/Home'
import { CategoryItem, ProductPublicInfo, StoreSettings } from '~/types'
import * as mocks from '~/utils/mocks'

jest.mock('dexie', () => {
  return class Dexie {
    open = () => Promise.resolve()
    version() {
      return {
        stores: jest.fn(),
      }
    }
  }
})

jest.mock('dexie-react-hooks', () => ({
  useLiveQuery: jest.fn().mockReturnValue([
    {
      id: '123',
      name: 'test product',
      coverImage: 'https://test.png',
      slug: 'test-product',
      url: '/products/test-product',
      price: '10',
      quantity: 1,
    },
  ]),
}))

describe('Home page component', () => {
  test('Testing Home page component rendering', async () => {
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

    render(
      <StoreContext.Provider
        value={{
          storeSettings: (await mocks.getStoreInfo()) as StoreSettings,
          categories: mockCategories,
          publicPages: [],
        }}
      >
        <Home
          products={(await mocks.getMockProducts()) as ProductPublicInfo[]}
        />
      </StoreContext.Provider>,
      { wrapper: MemoryRouter },
    )

    expect(
      screen.getByText('Denim Deluxe Jeans - Classic Indigo'),
    ).toBeDefined()
    const { getByText } = within(screen.getByTestId('cart-badge'))
    expect(getByText('1')).toBeInTheDocument()
  })
})
