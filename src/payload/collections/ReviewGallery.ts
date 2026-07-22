import { CollectionConfig } from 'payload'

export const ReviewGallery: CollectionConfig = {
  slug: 'review-gallery',
  labels: {
    singular: 'Gallery Image',
    plural: 'Review Gallery',
  },
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'displayOrder', 'status'],
    group: 'Shop',
    description: 'Images for the "Loved in Real Life" gallery on the Reviews page',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption / Alt text',
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers show first' },
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
  ],
  timestamps: true,
}
