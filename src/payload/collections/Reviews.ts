import { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: {
    singular: 'Review',
    plural: 'Reviews',
  },
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'location', 'rating', 'featured', 'status'],
    group: 'Shop',
    description: 'Customer reviews shown on the Reviews page',
  },
  access: {
    read: () => true, // public — shown on the storefront
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'author',
      type: 'text',
      required: true,
      label: 'Customer Name',
      admin: { placeholder: 'e.g., Priya M.' },
    },
    {
      name: 'location',
      type: 'text',
      label: 'Location',
      admin: { placeholder: 'e.g., Delhi' },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      defaultValue: 5,
      min: 1,
      max: 5,
      label: 'Rating (1–5)',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Review',
      admin: { placeholder: 'What the customer said…' },
    },
    {
      name: 'verifiedBuyer',
      type: 'checkbox',
      defaultValue: true,
      label: 'Verified Buyer',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show on Reviews page',
      admin: { description: 'Featured reviews appear in the "What Our Customers Say" carousel' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Hidden', value: 'hidden' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
      admin: { position: 'sidebar', description: 'Lower numbers show first' },
    },
  ],
  timestamps: true,
}
