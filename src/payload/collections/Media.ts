import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  admin: {
    group: 'Content',
    description: 'Upload and manage images and files',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      admin: {
        description: 'Describe the image for accessibility and SEO',
      },
      validate: () => true as const,
    },
    {
      name: 'filename',
      type: 'text',
      label: 'Filename',
      admin: {
        readOnly: true,
      },
      validate: () => true as const,
    },
    {
      name: 'mimeType',
      type: 'text',
      label: 'MIME Type',
      admin: {
        readOnly: true,
      },
      validate: () => true as const,
    },
    {
      name: 'filesize',
      type: 'number',
      label: 'File Size',
      admin: {
        readOnly: true,
      },
      validate: () => true as const,
    },
    {
      name: 'base64',
      type: 'text',
      label: 'Image Data',
      admin: {
        hidden: true,
      },
      validate: () => true as const,
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { label: 'Product Image', value: 'product' },
        { label: 'Collection Banner', value: 'collection' },
        { label: 'Hero Image', value: 'hero' },
        { label: 'Lifestyle', value: 'lifestyle' },
        { label: 'About/Brand', value: 'brand' },
        { label: 'Icon', value: 'icon' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
