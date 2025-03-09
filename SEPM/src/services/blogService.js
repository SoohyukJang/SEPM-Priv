import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where, 
  limit,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';

// 블로그 글 가져오기 (최신순)
export const fetchBlogPosts = async (limitCount = 10) => {
  try {
    const blogRef = collection(db, 'blogPosts');
    const q = query(blogRef, orderBy('createdAt', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

// 인기 블로그 글 가져오기 (좋아요 많은 순)
export const fetchPopularBlogPosts = async (limitCount = 5) => {
  try {
    const blogRef = collection(db, 'blogPosts');
    const q = query(blogRef, orderBy('likeCount', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching popular blog posts:', error);
    throw error;
  }
};

// 특정 블로그 글 가져오기
export const fetchBlogPost = async (postId) => {
  try {
    const docRef = doc(db, 'blogPosts', postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      };
    } else {
      throw new Error('Blog post not found');
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
};

// 블로그 글 생성
export const createBlogPost = async (userId, postData, image = null) => {
  try {
    // 이미지가 있는 경우 Storage에 업로드
    let imageUrl = null;
    if (image) {
      const storageRef = ref(storage, `blog-images/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    // Firestore에 블로그 포스트 추가
    const docRef = await addDoc(collection(db, 'blogPosts'), {
      ...postData,
      imageUrl,
      authorId: userId,
      likeCount: 0,
      likes: [],
      bookmarks: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      ...postData,
      imageUrl,
      authorId: userId,
      likeCount: 0,
      likes: [],
      bookmarks: []
    };
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

// 블로그 글 수정
export const updateBlogPost = async (postId, updateData, image = null) => {
  try {
    const postRef = doc(db, 'blogPosts', postId);
    
    // 이미지가 있는 경우 Storage에 업로드
    let imageUrl = updateData.imageUrl;
    if (image) {
      const storageRef = ref(storage, `blog-images/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    // Firestore 문서 업데이트
    await updateDoc(postRef, {
      ...updateData,
      imageUrl,
      updatedAt: serverTimestamp()
    });
    
    return {
      id: postId,
      ...updateData,
      imageUrl,
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

// 블로그 글 삭제
export const deleteBlogPost = async (postId) => {
  try {
    // 블로그 포스트 삭제
    await deleteDoc(doc(db, 'blogPosts', postId));
    
    // 관련 댓글도 삭제 (옵션)
    const commentsRef = collection(db, 'blogPosts', postId, 'comments');
    const commentsSnapshot = await getDocs(commentsRef);
    
    const deletePromises = commentsSnapshot.docs.map(commentDoc => 
      deleteDoc(doc(db, 'blogPosts', postId, 'comments', commentDoc.id))
    );
    
    await Promise.all(deletePromises);
    
    return true;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

// 좋아요 토글
export const toggleLike = async (postId, userId) => {
  try {
    const postRef = doc(db, 'blogPosts', postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      throw new Error('Blog post not found');
    }
    
    const post = postSnap.data();
    const likes = post.likes || [];
    
    if (likes.includes(userId)) {
      // 좋아요 취소
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
        likeCount: increment(-1)
      });
      return { liked: false, likeCount: (post.likeCount || 1) - 1 };
    } else {
      // 좋아요 추가
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
        likeCount: increment(1)
      });
      return { liked: true, likeCount: (post.likeCount || 0) + 1 };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// 북마크 토글
export const toggleBookmark = async (postId, userId) => {
  try {
    const postRef = doc(db, 'blogPosts', postId);
    const userRef = doc(db, 'users', userId);
    
    const postSnap = await getDoc(postRef);
    const userSnap = await getDoc(userRef);
    
    if (!postSnap.exists() || !userSnap.exists()) {
      throw new Error('Blog post or user not found');
    }
    
    const post = postSnap.data();
    const bookmarks = post.bookmarks || [];
    
    // 사용자 즐겨찾기 목록
    const userData = userSnap.data();
    const userBookmarks = userData.bookmarkedPosts || [];
    
    if (bookmarks.includes(userId)) {
      // 북마크 취소
      await updateDoc(postRef, {
        bookmarks: arrayRemove(userId)
      });
      
      // 사용자 문서에서도 북마크 제거
      await updateDoc(userRef, {
        bookmarkedPosts: arrayRemove(postId)
      });
      
      return { bookmarked: false };
    } else {
      // 북마크 추가
      await updateDoc(postRef, {
        bookmarks: arrayUnion(userId)
      });
      
      // 사용자 문서에도 북마크 추가
      await updateDoc(userRef, {
        bookmarkedPosts: arrayUnion(postId)
      });
      
      return { bookmarked: true };
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    throw error;
  }
};

// 사용자가 북마크한 블로그 포스트 가져오기
export const fetchBookmarkedPosts = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userSnap.data();
    const bookmarkedIds = userData.bookmarkedPosts || [];
    
    if (bookmarkedIds.length === 0) {
      return [];
    }
    
    // 북마크된 포스트들 가져오기
    const posts = [];
    for (const postId of bookmarkedIds) {
      const postSnap = await getDoc(doc(db, 'blogPosts', postId));
      if (postSnap.exists()) {
        posts.push({
          id: postSnap.id,
          ...postSnap.data(),
          createdAt: postSnap.data().createdAt?.toDate(),
          updatedAt: postSnap.data().updatedAt?.toDate()
        });
      }
    }
    
    return posts;
  } catch (error) {
    console.error('Error fetching bookmarked posts:', error);
    throw error;
  }
};

// 댓글 가져오기
export const fetchComments = async (postId) => {
  try {
    const commentsRef = collection(db, 'blogPosts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// 댓글 추가
export const addComment = async (postId, userId, content, userName) => {
  try {
    const commentsRef = collection(db, 'blogPosts', postId, 'comments');
    
    const docRef = await addDoc(commentsRef, {
      content,
      authorId: userId,
      authorName: userName,
      createdAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      content,
      authorId: userId,
      authorName: userName,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// 댓글 삭제
export const deleteComment = async (postId, commentId) => {
  try {
    await deleteDoc(doc(db, 'blogPosts', postId, 'comments', commentId));
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
