//
// This code should be generated from the API specfication using tools
// such as https://github.com/OpenAPITools/openapi-generator
//

import {
  fakeGetBlogPosts,
  fakePostBlogPost,
  fakePostUser,
} from "./fakeHttpServer";

export async function getBlogPostsApiClient(
  _apiBaseUrl: string,
  authorId: string,
): Promise<HttpResponse<BlogPost[]>> {
  // ----------------------------------------------------------------------
  // Here a fake server is used only to make it easier to run the example.
  // In a real-world scenario, API tests must send
  // HTTP requests to real HTTP servers.
  // ----------------------------------------------------------------------
  return await fakeGetBlogPosts(authorId);
}

export async function postBlogPostApiClient(
  _apiBaseUrl: string,
  request: BlogPost,
): Promise<HttpResponse<BlogPost>> {
  // ----------------------------------------------------------------------
  // Here a fake server is used only to make it easier to run the example.
  // In a real-world scenario, API tests must send
  // HTTP requests to real HTTP servers.
  // ----------------------------------------------------------------------
  return await fakePostBlogPost(request);
}

export async function postUserApiClient(
  _apiBaseUrl: string,
  request: User,
): Promise<HttpResponse<User>> {
  // ----------------------------------------------------------------------
  // Here a fake server is used only to make it easier to run the example.
  // In a real-world scenario, API tests must send
  // HTTP requests to real HTTP servers.
  // ----------------------------------------------------------------------
  return await fakePostUser(request);
}

export interface HttpResponse<T> {
  httpStatusCode: number;
  body: T;
}

export class ApiError {
  message: string;
}

export interface BlogPost {
  id: string;
  title: string;
  keywords: string[];
  content: string;
  likeCount: number;
  commentCount: number;
  authorId: string;
}

export interface User {
  id: string;
  role: string;
  fullName: string;
  email: string;
}
