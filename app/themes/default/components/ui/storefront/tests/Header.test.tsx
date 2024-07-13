import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CategoryItem } from '~/types'
import * as mocks from '~/utils/mocks'
import Header from '../Header'

describe('Testing storefront Header component', () => {
  test('Testing storefront Header without logo image', async () => {
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
