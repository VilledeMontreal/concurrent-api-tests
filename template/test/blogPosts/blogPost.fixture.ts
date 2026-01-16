import {
  BlogPost,
  postBlogPost as postBlogPostApiClient,
  postBlogPostResponseSuccess,
  searchBlogPosts as searchBlogPostsApiClient,
  searchBlogPostsResponseSuccess,
  SearchBlogPostsParams,
} from "../shared/apiUnderTest/generated/api";

export async function postBlogPost(
  request: BlogPost
): Promise<postBlogPostResponseSuccess> {
  return (await postBlogPostApiClient(request)) as postBlogPostResponseSuccess;
}

export async function searchBlogPosts(
  params: SearchBlogPostsParams
): Promise<searchBlogPostsResponseSuccess> {
  return (await searchBlogPostsApiClient(
    params
  )) as searchBlogPostsResponseSuccess;
}
