import { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: {
    singular: 'Subscriber',
    plural: 'Subscribers',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'source', 'createdAt'],
    group: 'Marketing',
    description: 'Newsletter subscribers',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => true, // Allow public signup
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: 'Email Address',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
        { label: 'Bounced', value: 'bounced' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'footer',
      options: [
        { label: 'Footer Form', value: 'footer' },
        { label: 'Popup', value: 'popup' },
        { label: 'Checkout', value: 'checkout' },
        { label: 'Manual', value: 'manual' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      label: 'Unsubscribed Date',
      admin: {
        condition: (data) => data.status === 'unsubscribed',
      },
    },
  ],
  timestamps: true,
}
