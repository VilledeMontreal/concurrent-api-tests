import { shouldThrow } from '@villedemontreal/mocha-concurrent-api-tests';
import { assert } from 'chai';
import { describe, it } from 'vitest'
import { postUser } from '../users/user.fixture';
import { copyUserTemplate } from '../users/user.template';
import { getBlogPosts, postBlogPost, postBlogPostWithDefaultAuthor } from './blogPost.fixture';
import { copyBlogPostTemplate } from './blogPost.template';

export function blogPostApiTests() {
  describe('BlogPosts', () => { 
    // data partition: by blogPost id
    it('Create', async () => {
      // arrange only what is meaningful for the test
      const request = copyBlogPostTemplate(x => {
        x.title = 'Incredible story!';
      });

      // act
      const actual = await postBlogPostWithDefaultAuthor(request);

      // assert
      assert.strictEqual(actual.body.title, 'Inc222redible story!');
    });

    // data partition: by blogPost id
    it('Title is required', async () => {
      const request = copyBlogPostTemplate(x => {
        x.title = null;
      });

      await shouldThrow(
        () => postBlogPostWithDefaultAuthor(request),
        err => {
          assert.strictEqual(err.httpStatusCode, 400);
          assert.include(err.body.message, 'title');
          assert.include(err.body.message, 'required');
        }
      );
    });

    // data partition: by blogPost authorId
    it('Search by author', async () => {
      const author = await postUser(copyUserTemplate());
      // Using Promise.all avoids blocking on I/O
      const [blogPost1, blogPost2] = await Promise.all([
        postBlogPost(
          copyBlogPostTemplate(x => {
            x.title = 'first result';
            x.authorId = author.body.id;
          })
        ),
        postBlogPost(
          copyBlogPostTemplate(x => {
            x.title = 'second result';
            x.authorId = author.body.id;
          })
        )
      ]);
      const actual = await getBlogPosts(author.body.id);

      assert.strictEqual(actual.body.length, 2);
      assert.sameMembers(
        actual.body.map(x => x.id),
        [blogPost1.body.id, blogPost2.body.id]
      );
    });

    it('Anti-pattern: Asserting on default values', async () => {
      const dontDoThatRequest = copyBlogPostTemplate();
      // Arranging what is meaningful for the test
      // - allows to communicate what is meaningful for the test
      // - prevents side effects when a default values change
      // - allows for easier debugging
      const doThisRequest = copyBlogPostTemplate(x => {
        x.title = 'A meaningful title';
      });

      const dontDoThatResponse = await postBlogPostWithDefaultAuthor(dontDoThatRequest);
      const doThisResponse = await postBlogPostWithDefaultAuthor(doThisRequest);

      assert.strictEqual(dontDoThatResponse.body.title, 'titleDefault');
      assert.strictEqual(doThisResponse.body.title, 'A meaningful title');
    });
 });   
}
