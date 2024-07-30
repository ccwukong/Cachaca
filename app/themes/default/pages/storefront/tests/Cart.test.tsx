import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import StoreContext from '~/contexts/storeContext'
import Cart from '~/themes/default/pages/storefront/Cart'
import {
  AddressItem,
  CategoryItem,
  ProductPublicInfo,
  StoreSettings,
} from '~/types'
import * as mocks from '~/utils/mocks'

describe('Cart page component', () => {
  test('Testing Cart page component rendering with guest checkout', async () => {
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

    const router = createMemoryRouter([
      {
        path: '*',
        element: (
          <StoreContext.Provider
            value={{
              storeSettings: (await mocks.getStoreInfo()) as StoreSettings,
              categories: mockCategories,
              publicPages: [],
            }}
          >
            <Cart
              addresses={(await mocks.getMockAddresses()) as AddressItem[]}
              shippingFee="9.9"
              allowVoucher={false}
              allowGuestCheckout={true}
              suggestedProducts={
                (await mocks.getMockProducts()) as ProductPublicInfo[]
              }
              account={null}
            />
          </StoreContext.Provider>
        ),
      },
    ])

    render(<RouterProvider router={router} />)

    expect(screen.getByText('system.my_cart_ph')).toBeDefined()
    expect(screen.getAllByText('$9.9')).toBeDefined()
    expect(screen.getByText('system.checkout_as_guest')).toBeDefined()
  })

  test('Testing Cart page component rendering with logged in user', async () => {
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

    const router = createMemoryRouter([
      {
        path: '*',
        element: (
          <StoreContext.Provider
            value={{
              storeSettings: (await mocks.getStoreInfo()) as StoreSettings,
              categories: mockCategories,
              publicPages: [],
            }}
          >
            <Cart
              addresses={(await mocks.getMockAddresses()) as AddressItem[]}
              shippingFee="9.9"
              allowVoucher={false}
              allowGuestCheckout={false}
              suggestedProducts={
                (await mocks.getMockProducts()) as ProductPublicInfo[]
              }
              account={{
                id: '123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'test@test.com',
              }}
            />
          </StoreContext.Provider>
        ),
      },
    ])

    render(<RouterProvider router={router} />)

    expect(screen.getByText('Waterpoint')).toBeDefined()
    expect(() => screen.getByText('system.checkout_as_guest')).toThrow(
      'Unable to find an element',
    )
  })
})
