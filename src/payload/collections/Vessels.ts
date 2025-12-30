import type { CollectionConfig } from 'payload'

export const Vessels: CollectionConfig = {
  slug: 'vessels',
  labels: {
    singular: 'Vessel',
    plural: 'Vessels',
  },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'material', 'upcharge', 'active'],
    group: 'Shop',
    description: 'Configurable candle jars used in the Custom Candle Builder',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      label: 'Display Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Identifier',
    },
    {
      name: 'material',
      type: 'text',
      label: 'Material / Finish',
    },
    {
      name: 'sensoryDescription',
      type: 'textarea',
      label: 'Sensory Description',
      admin: {
        description: 'Short, poetic line that describes how this vessel feels.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Technical / Merch Description',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Vessel Image',
      admin: {
        description: 'High‑resolution PNG with transparent background or clean lifestyle shot.',
      },
    },
    {
      name: 'upcharge',
      type: 'number',
      label: 'Price Upcharge (INR)',
      defaultValue: 0,
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Sort Order',
      defaultValue: 0,
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
    },
  ],
  timestamps: true,
}
