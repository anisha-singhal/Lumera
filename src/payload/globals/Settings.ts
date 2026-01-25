import { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Settings',
  admin: {
    group: 'Admin',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Shipping',
          fields: [
            {
              name: 'shippingCost',
              type: 'number',
              required: true,
              defaultValue: 99,
              label: 'Standard Shipping Cost (₹)',
            },
            {
              name: 'freeShippingThreshold',
              type: 'number',
              required: true,
              defaultValue: 999,
              label: 'Free Shipping Threshold (₹)',
            },
          ],
        },
        {
          label: 'Tax',
          fields: [
            {
              name: 'gstRate',
              type: 'number',
              required: true,
              defaultValue: 18,
              label: 'GST Rate (%)',
            },
          ],
        },
        {
          label: 'Contact Info',
          fields: [
            {
              name: 'email',
              type: 'email',
              label: 'Support Email',
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Support Phone',
            },
            {
              name: 'address',
              type: 'textarea',
              label: 'Store Address',
            },
          ],
        },
      ],
    },
  ],
}
