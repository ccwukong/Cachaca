import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CustomerContext from '~/contexts/customerContext'
import ForgotPassword from '~/themes/default/pages/account/ForgotPassword'
import { Role, StoreSettings } from '~/types'
import * as mocks from '~/utils/mocks'

describe('ForgotPassword page component', () => {
  test('Testing ForgotPassword page component rendering', async () => {
    render(
      <CustomerContext.Provider
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
        }}
      >
        <ForgotPassword />
      </CustomerContext.Provider>,
      { wrapper: MemoryRouter },
    )

    expect(screen.getByText('system.email')).toBeDefined()
  })
})
