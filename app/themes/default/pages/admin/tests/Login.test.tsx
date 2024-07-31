import { render, screen } from '@testing-library/react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AdminContext from '~/contexts/adminContext'
import ForgotPassword from '~/themes/default/pages/account/ForgotPassword'
import { Role, StoreSettings } from '~/types'
import * as mocks from '~/utils/mocks'

describe('Admin Login page component', () => {
  test('testing Admin Login page component rendering', async () => {
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
            <ForgotPassword />
          </AdminContext.Provider>
        ),
      },
    ]

    const router = createBrowserRouter(routes)

    render(<RouterProvider router={router} />)

    expect(screen.getByText('system.get_reset_password_link')).toBeDefined()
  })
})
