import {
  BlogPost,
  postBlogPost as postBlogPostApiClient,
  searchBlogPosts as searchBlogPostsApiClient,
} from "../shared/apiUnderTest/generated/api";

export async function postBlogPost(request: BlogPost): Promise<BlogPost> {
  return await postBlogPostApiClient(request);
}

export async function searchBlogPosts(theme: string): Promise<BlogPost[]> {
  return await searchBlogPostsApiClient({ theme });
}
