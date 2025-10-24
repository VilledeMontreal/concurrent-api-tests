import { assert } from "chai";
import {
  BlogPost,
  getBlogPostsApiClient,
  HttpResponse,
  postBlogPostApiClient,
} from "../shared/apiUnderTest/apiClient";
import { apiUnderTestConfig } from "../shared/apiUnderTest/apiUnderTestConfig";
import { getImmutableGuessUser } from "../users/user.fixture";

export async function postBlogPostWithDefaultAuthor(
  request: BlogPost,
): Promise<HttpResponse<BlogPost>> {
  assert.isNull(
    request.authorId,
    "createBlogPostWithDefaultUser is intented to be invoked with request.authorId=null.",
  );

  const guessUser = await getImmutableGuessUser();
  request.authorId = guessUser.id;

  return await postBlogPost(request);
}

export async function postBlogPost(
  request: BlogPost,
): Promise<HttpResponse<BlogPost>> {
  return await postBlogPostApiClient(apiUnderTestConfig.apiBaseUrl, request);
}

export async function getBlogPosts(
  authorId: string,
): Promise<HttpResponse<BlogPost[]>> {
  return await getBlogPostsApiClient(apiUnderTestConfig.apiBaseUrl, authorId);
}
