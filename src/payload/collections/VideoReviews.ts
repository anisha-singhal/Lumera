import { CollectionConfig } from 'payload'

export const VideoReviews: CollectionConfig = {
  slug: 'video-reviews',
  labels: {
    singular: 'Video Review',
    plural: 'Video Reviews',
  },
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'location', 'displayOrder', 'status'],
    group: 'Shop',
    description: 'Short customer video reviews shown on the Reviews page',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'videoId',
      type: 'text',
      required: true,
      label: 'Video (media id)',
      admin: { description: 'Id of the uploaded MP4 in the media store' },
    },
    {
      name: 'posterId',
      type: 'text',
      label: 'Poster image (media id)',
      admin: { description: 'Optional thumbnail shown before the video plays' },
    },
    {
      name: 'author',
      type: 'text',
      label: 'Customer Name',
    },
    {
      name: 'location',
      type: 'text',
      label: 'Location',
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
