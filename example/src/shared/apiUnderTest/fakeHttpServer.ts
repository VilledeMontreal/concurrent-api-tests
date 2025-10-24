// ----------------------------------------------------------------------
// Here a fake server is used only to make it easier to run the example.
// In a real-world scenario, API tests must send
// HTTP requests to real HTTP servers.
// ----------------------------------------------------------------------

import { aFewSeconds } from "@villedemontreal/mocha-concurrent-api-tests";
import { ApiError, BlogPost, HttpResponse, User } from "./apiClient";

export async function fakeGetBlogPosts(
  authorId: string,
): Promise<HttpResponse<BlogPost[]>> {
  await fakeHttpRequestExecutionTime();

  const body = searchBlogPosts(authorId);

  return {
    httpStatusCode: 200,
    body,
  };
}

export async function fakePostBlogPost(
  request: BlogPost,
): Promise<HttpResponse<BlogPost>> {
  await fakeHttpRequestExecutionTime();

  ensureTitleIsRequired(request);
  ensureAuthorExists(request);

  const id = createBlogPost(request);
  const body = getBlogPostById(id);

  return {
    httpStatusCode: 200,
    body,
  };
}

export async function fakePostUser(request: User): Promise<HttpResponse<User>> {
  await fakeHttpRequestExecutionTime();

  const id = createUser(request);
  const body = getUserById(id);

  return {
    httpStatusCode: 200,
    body,
  };
}

function ensureTitleIsRequired(request: BlogPost) {
  if (!request.title) {
    const errrorResponse: HttpResponse<ApiError> = {
      httpStatusCode: 400,
      body: {
        message: "The title is required",
      },
    };
    throw errrorResponse;
  }
}

function ensureAuthorExists(request: BlogPost) {
  const author = getUserById(request.authorId);
  if (!author) {
    const errrorResponse: HttpResponse<ApiError> = {
      httpStatusCode: 400,
      body: {
        message: `The author ${request.authorId} does not exist.`,
      },
    };
    throw errrorResponse;
  }
}

async function fakeHttpRequestExecutionTime() {
  await aFewSeconds(1);
}

const _blogPostCollection: BlogPost[] = [];
const _userCollection: User[] = [];

function searchBlogPosts(authorId: string): BlogPost[] {
  return _blogPostCollection.filter((x) => x.authorId === authorId);
}

function getBlogPostById(id: string): BlogPost {
  return _blogPostCollection.filter((x) => x.id === id)[0] || null;
}

function createBlogPost(blogPost: BlogPost): string {
  blogPost.id = nextIncrementalId(_blogPostCollection);
  _blogPostCollection.push(blogPost);
  return blogPost.id;
}

function getUserById(id: string): User {
  return _userCollection.filter((x) => x.id === id)[0] || null;
}

function createUser(user: User): string {
  user.id = nextIncrementalId(_userCollection);
  _userCollection.push(user);
  return user.id;
}

function nextIncrementalId(collection: any[]) {
  return (collection.length + 1).toString();
}
