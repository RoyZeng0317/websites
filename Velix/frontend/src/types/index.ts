export type SocialPlatform = 'instagram' | 'threads' | 'twitter' | 'tiktok' | 'youtube' | 'custom'

export interface SocialLink {
  platform: SocialPlatform
  url: string
  label?: string
}

export interface UserModel {
  uid: string
  username: string
  displayName: string
  photoUrl: string
  bio: string
  followersCount: number
  followingCount: number
  postsCount: number
  isPrivate: boolean
  socialLinks: SocialLink[]
  createdAt: number
  verificationStatus?: 'pending' | 'verified' | 'rejected'
  interests?: Record<string, number>
}

export const POST_CATEGORIES = [
  '一般生活', '美食', '旅遊', '科技', '運動', '音樂', '藝術', '時尚', '情色', '其他',
] as const
export type PostCategory = typeof POST_CATEGORIES[number]

export interface PostModel {
  id: string
  authorId: string
  authorName: string
  authorUsername: string
  authorPhotoUrl: string
  content: string
  imageUrl?: string
  videoUrl?: string
  mediaUrls?: string[]
  locationName?: string
  musicTitle?: string
  musicArtist?: string
  category?: PostCategory
  hashtags: string[]
  likesCount: number
  commentsCount: number
  viewsCount: number
  repostsCount: number
  createdAt: number
}

export interface CommentModel {
  id: string
  authorId: string
  authorName: string
  authorUsername: string
  authorPhotoUrl: string
  content: string
  createdAt: number
}

export interface NotificationModel {
  id: string
  toUserId: string
  fromUserId: string
  fromUserName: string
  fromUserPhoto: string
  type: 'like' | 'comment' | 'follow' | 'followRequest' | 'verified' | 'announcement'
  postId?: string
  postContent?: string
  isRead: boolean
  createdAt: number
}

export interface ChatRoom {
  id: string
  participants: string[]
  lastMessage: string
  lastMessageTime: number
  unreadCount: Record<string, number>
  hiddenFor: string[]
}

export interface MessageModel {
  id: string
  senderId: string
  content: string
  imageUrl?: string
  isRead: boolean
  isRecalled: boolean
  isEdited: boolean
  createdAt: number
}

export interface AiMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface StoryModel {
  id: string
  uid: string
  displayName: string
  photoUrl: string
  imageUrl: string
  createdAt: number
  expiresAt: number
  viewedBy: string[]
}

export interface StoryGroup {
  uid: string
  displayName: string
  photoUrl: string
  items: StoryModel[]
}
