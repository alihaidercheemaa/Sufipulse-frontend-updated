// services/blogger.ts
import api from "@/lib/axios";

export const submitBloggerProfile = (data: any) => {
  return api.post(`/bloggers/submit-profile`, data, {
    headers: {
      requiresAuth: true,
    },
  });
};

export const getBloggerProfile = (userId: number) => {
  return api.get(`/bloggers/get/${userId}`, {
    headers: {
      requiresAuth: true,
    },
  });
};

export const checkBloggerRegistration = () => {
  return api.get(`/bloggers/is-registered`, {
    headers: {
      requiresAuth: true,
    },
  });
};

export const getMyBlogSubmissions = () => {
  return api.get(`/bloggers/my-blogs`, {
    headers: {
      requiresAuth: true,
    },
  });
};

export const getBlogSubmissionById = (blogId: number) => {
  return api.get(`/bloggers/blog/${blogId}`, {
    headers: {
      requiresAuth: true,
    },
  });
};

export const submitBlogPost = (data: any) => {
  return api.post(`/bloggers/submit-blog`, data, {
    headers: {
      requiresAuth: true,
    },
  });
};

export const approveOrRejectBlog = (blogId: number, data: any) => {
  return api.post(`/bloggers/blog/${blogId}/approval`, data, {
    headers: {
      requiresAuth: true,
    },
  });
};

export const updateBlogPost = (blogId: number, data: any) => {
  return api.put(`/bloggers/blog/${blogId}`, data, {
    headers: {
      requiresAuth: true,
    },
  });
};

export const uploadBlogImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post(`/bloggers/upload-image`, formData, {
    headers: {
      requiresAuth: true,
      'Content-Type': 'multipart/form-data',
    },
  });
};

// ==================== BLOG ENGAGEMENT SERVICES ====================

export const getBlogEngagementStats = (blogId: number) => {
  return api.get(`/public/blogs/${blogId}/engagement`, {
    headers: {
      requiresAuth: false,
    },
  });
};

export const getBlogComments = (blogId: number, page = 1, limit = 10) => {
  return api.get(`/public/blogs/${blogId}/comments?page=${page}&limit=${limit}`, {
    headers: {
      requiresAuth: false,
    },
  });
};

export const submitBlogComment = (blogId: number, data: {
  commenter_name: string;
  commenter_email: string;
  comment_text: string;
  parent_id?: number;
}) => {
  return api.post(`/public/blogs/${blogId}/comments`, data, {
    headers: {
      requiresAuth: false,
    },
  });
};

export const likeBlog = (blogId: number) => {
  return api.post(`/public/blogs/${blogId}/like`, {}, {
    headers: {
      requiresAuth: false,
    },
  });
};

export const trackBlogView = (blogId: number) => {
  return api.post(`/public/blogs/${blogId}/view`, {}, {
    headers: {
      requiresAuth: false,
    },
  });
};

export const shareBlog = (blogId: number, platform: string) => {
  return api.post(`/public/blogs/${blogId}/share`, { platform }, {
    headers: {
      requiresAuth: false,
    },
  });
};

export const approveBlogComment = (commentId: number) => {
  return api.post(`/public/comments/${commentId}/approve`, {}, {
    headers: {
      requiresAuth: true,
    },
  });
};

export const rejectBlogComment = (commentId: number) => {
  return api.post(`/public/comments/${commentId}/reject`, {}, {
    headers: {
      requiresAuth: true,
    },
  });
};

export const deleteBlogComment = (commentId: number) => {
  return api.delete(`/public/comments/${commentId}`, {
    headers: {
      requiresAuth: true,
    },
  });
};

export const getMyBlogComments = () => {
  return api.get(`/bloggers/my-comments`, {
    headers: {
      requiresAuth: true,
    },
  });
};