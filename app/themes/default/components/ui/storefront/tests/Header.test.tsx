import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as mocks from '~/utils/mocks'
import { CategoryItem } from '~/models'
import Header from '../Header'

describe('Testing storefront header component', () => {
  test('Testing storefront header without logo image', async () => {
    const user = userEvent.setup()

    const mockdata: CategoryItem[] = (
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
      <Header storeLogo="" storeName="cachaca store" menuItems={mockdata} />,
      { wrapper: MemoryRouter },
    )

    expect(screen.getByText('cachaca store')).toBeDefined()
    expect(screen.getAllByText('Men')).toBeDefined()
  })
})
