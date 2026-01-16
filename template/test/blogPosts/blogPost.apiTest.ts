import {
  shouldThrow,
  getTestRunId,
} from "@villedemontreal/concurrent-api-tests";
import { assert } from "chai";
import { postBlogPost, searchBlogPosts } from "./blogPost.fixture";
import { copyBlogPostTemplate } from "./blogPost.template";

export function blogPostApiTests() {
  describe("Blog post management", () => {
    describe("Title is mandatory for blog post creation", () => {
      it("Successfully create a blog post with a title", async () => {
        const request = copyBlogPostTemplate((x) => {
          x.title = "Introduction to API Testing";
        });

        const actual = await postBlogPost(request);

        assert.strictEqual(actual.data.title, "Introduction to API Testing");
        assert.strictEqual(actual.data.likeCount, 0);
        assert.strictEqual(actual.data.commentCount, 0);
      });

      it("Cannot create a blog post without a title", async () => {
        const request = copyBlogPostTemplate((x) => {
          x.title = "";
        });

        await shouldThrow(
          () => postBlogPost(request),
          (err) => {
            assert.strictEqual(err.status, 400);
            assert.include(err.data.message, "The title is required.");
          }
        );
      });
    });

    describe("Blog posts can be searched by keyword", () => {
      it("Search returns only blog posts containing the specified keyword", async () => {
        const themeApi = `${getTestRunId()}-api`;
        const themeGherkin = `${getTestRunId()}-gherkin`;

        const [blogPost1] = await Promise.all([
          postBlogPost(
            copyBlogPostTemplate((x) => {
              x.title = "API testing blog post";
              x.keywords = [themeApi];
            })
          ),
          postBlogPost(
            copyBlogPostTemplate((x) => {
              x.title = "BDD blog post";
              x.keywords = [themeGherkin];
            })
          ),
        ]);

        const actual = await searchBlogPosts({ theme: themeApi });

        assert.strictEqual(actual.data.length, 1);
        assert.strictEqual(actual.data[0].id, blogPost1.data.id);
        assert.strictEqual(actual.data[0].title, "API testing blog post");
      });
    });
  });
}
