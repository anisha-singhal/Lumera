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
  // Disable all validation hooks
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Return data as-is, bypassing default validation
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
    },
    {
      name: 'filename',
      type: 'text',
      label: 'Filename',
    },
    {
      name: 'mimeType',
      type: 'text',
      label: 'MIME Type',
    },
    {
      name: 'filesize',
      type: 'number',
      label: 'File Size',
    },
    {
      name: 'base64',
      type: 'text',
      label: 'Image Data',
      admin: {
        hidden: true,
      },
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
    },
  ],
}
