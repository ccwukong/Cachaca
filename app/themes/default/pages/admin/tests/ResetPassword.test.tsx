import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import AdminContext from '~/contexts/adminContext'
import ResetPassword from '~/themes/default/pages/admin/ResetPassword'
import { Role, StoreSettings } from '~/types'
import * as mocks from '~/utils/mocks'

describe('Admin ResetPassword page component', () => {
  test('testing Admin ResetPassword page component rendering', async () => {
    const routes = [
      {
        path: '*',
        element: (
          <AdminContext.Provider
            value={{
              storeSettings: (await mocks.getStoreInfo()) as StoreSettings,
              account: {
                id: '123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'XXXXXXXXXXXXX',
                phone: 'XXXXXXXXXXXXX',
                avatar: 'XXXXXXXXXXXXX',
                role: Role.Customer,
              },
              navItems: [],
            }}
          >
            <ResetPassword email="test@test.com" />
          </AdminContext.Provider>
        ),
      },
    ]

    const router = createMemoryRouter(routes)

    render(<RouterProvider router={router} />)

    expect(screen.getByDisplayValue('test@test.com')).toBeDefined()
  })
})
