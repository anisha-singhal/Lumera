import { CollectionConfig } from 'payload'

export const Fragrances: CollectionConfig = {
  slug: 'fragrances',
  labels: {
    singular: 'Fragrance',
    plural: 'Fragrances',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'createdAt'],
    group: 'Shop',
    description: 'Manage candle fragrances that can be assigned to products',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Fragrance Name',
      admin: {
        description: 'e.g., Lavender Dreams, Vanilla Bliss',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL-friendly identifier (auto-generated from name)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Optional description of this fragrance',
      },
    },
  ],
  timestamps: true,
}
