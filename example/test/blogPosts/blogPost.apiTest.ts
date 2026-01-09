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

        assert.strictEqual(actual.title, "Introduction to API Testing");
        assert.strictEqual(actual.likeCount, 0);
        assert.strictEqual(actual.commentCount, 0);
      });

      it("Cannot create a blog post without a title", async () => {
        const request = copyBlogPostTemplate((x) => {
          x.title = null as any;
        });

        await shouldThrow(
          () => postBlogPost(request),
          (err) => {
            assert.strictEqual(err.status, 400);
            assert.include(err.info.message, "The title is required.");
          }
        );
      });
    });

    describe("Blog posts can be searched by keyword", () => {
      it("Search returns only blog posts containing the specified keyword", async () => {
        const themeApi = `${getTestRunId()}-api`;
        const themeGherkin = `${getTestRunId()}-gherkin`;

        const [blogPostApi] = await Promise.all([
          postBlogPost(
            copyBlogPostTemplate((x) => {
              x.title = "API Testing";
              x.keywords = [themeApi];
            })
          ),
          postBlogPost(
            copyBlogPostTemplate((x) => {
              x.title = "BDD";
              x.keywords = [themeGherkin];
            })
          ),
        ]);

        const actual = await searchBlogPosts(themeApi);

        assert.strictEqual(actual.length, 1);
        assert.strictEqual(actual[0].id, blogPostApi.id);
        assert.strictEqual(actual[0].title, "API Testing");
      });
    });
  });
}
