import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import StoreContext from '~/contexts/storeContext'
import { CategoryItem, StoreSettings } from '~/types'
import * as mocks from '~/utils/mocks'
import CartItem from '../CartItem'

describe('CartItem component', () => {
  test('Testing CartItem component rendering', async () => {
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

    const mockCartItem: {
      id: string
      slug: string
      coverImage: string
      title: string
      currency: string
      price: string
      quantity: number
      updateCartItemHandler: (id: string, quantity: number) => void
    } = {
      id: '123',
      slug: 'test-item',
      coverImage: 'https://XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      title: 'test item',
      currency: '$',
      price: '10',
      quantity: 1,
      updateCartItemHandler: jest.fn(),
    }

    render(
      <StoreContext.Provider
        value={{
          storeSettings: (await mocks.getStoreInfo()) as StoreSettings,
          categories: mockCategories,
        }}
      >
        <CartItem {...mockCartItem} />
      </StoreContext.Provider>,
      { wrapper: MemoryRouter },
    )

    expect(screen.getByText('test item')).toBeDefined()
    expect(screen.getByText('$10')).toBeDefined()

    await user.click(await screen.findByTestId('delete-123'))
    expect(mockCartItem.updateCartItemHandler).toHaveBeenCalledTimes(1)
  })
})
