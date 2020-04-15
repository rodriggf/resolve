import { ReadModel } from 'resolve-core'
import { ResolveStore } from 'resolve-readmodel-base'
import { BLOG_POST_CREATED, BLOG_POST_DELETED } from '../blog-post.events'
import { getEncryption } from '../encryption'

const readModel: ReadModel<ResolveStore> = {
  Init: async (store): Promise<void> => {
    await store.defineTable('BlogPosts', {
      indexes: { author: 'string', id: 'string' },
      fields: ['timestamp', 'content']
    })
  },
  EncryptionFactory: (store, event) => getEncryption(store, event.aggregateId),
  [BLOG_POST_CREATED]: async (store, event, context): Promise<void> => {
    const {
      aggregateId,
      timestamp,
      payload: { authorId, content }
    } = event

    await store.insert('BlogPosts', {
      author: authorId,
      id: aggregateId,
      timestamp,
      content
    })
  },
  [BLOG_POST_DELETED]: async (store, event): Promise<void> =>
    store.delete('BlogPosts', {
      id: event.aggregateId
    })
}

export default readModel
