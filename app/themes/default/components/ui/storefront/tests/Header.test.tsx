import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import StoreContext from '~/contexts/storeContext'
import { CategoryItem, StoreSettings } from '~/types'
import * as mocks from '~/utils/mocks'
import Header from '../Header'

describe('Testing storefront Header component', () => {
  test('Testing storefront Header without logo image', async () => {
    const user = userEvent.setup()

    const mockCategories: CategoryItem[] = (
      (await mocks.getCategories()) as CategoryItem[]
    ).map((item) => {
      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        subCategories: item.subCategories,
      }
    })
    render(
      <StoreContext.Provider
        value={{
          storeSettings: (await mocks.getStoreInfo()) as StoreSettings,
          categories: mockCategories,
        }}
      >
        <Header />
      </StoreContext.Provider>,
      { wrapper: MemoryRouter },
    )

    expect(screen.getByText('Cachaca')).toBeDefined()
    expect(screen.getAllByText('Men')).toBeDefined()
  })
})
