import { CollectionConfig } from 'payload'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  labels: {
    singular: 'Coupon',
    plural: 'Coupons',
  },
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'type', 'value', 'active', 'expiresAt'],
    group: 'Shop',
  },
  access: {
    read: () => true, // Allow checking coupon validity from frontend
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Coupon Code',
      admin: {
        placeholder: 'E.g., WELCOME10',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'percentage',
      options: [
        { label: 'Percentage (%)', value: 'percentage' },
        { label: 'Fixed Amount (₹)', value: 'fixed' },
      ],
      label: 'Discount Type',
    },
    {
      name: 'value',
      type: 'number',
      required: true,
      label: 'Discount Value',
      admin: {
        description: 'Percentage or amount to deduct',
      },
    },
    {
      name: 'minOrderAmount',
      type: 'number',
      label: 'Minimum Order Amount (₹)',
      defaultValue: 0,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Is Active',
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Expiration Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'usageLimit',
      type: 'number',
      label: 'Usage Limit',
      admin: {
        description: 'Total number of times this coupon can be used (optional)',
      },
    },
    {
      name: 'usageCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
