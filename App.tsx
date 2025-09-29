import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from './Header';
import Sidebar from './components/Sidebar';
import PostCard from './components/icons/PostCard';
import PostForm from './components/PostForm';
import LoginModal from './components/LoginModal';
import ProfilePage from './components/ProfilePage';
import EditProfileModal from './components/EditProfileModal';
import Footer from './components/Footer';
import UserDirectory from './components/UserDirectory';
import { Post, User, Subject, SortOrder, UserRole, Reply, Notification, NotificationType } from './types';
import { SUBJECTS } from './constants';
import { useTranslations } from './useTranslations';
import { supabase } from './supabaseClient';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';


type View = { page: 'home' } | { page: 'profile', userId: string } | { page: 'directory' };

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [myDrafts, setMyDrafts] = useState<Post[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject>(Subject.ALL);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [view, setView] = useState<View>({ page: 'home' });
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const t = useTranslations();

  const buildReplyTree = useCallback((flatReplies: any[]): Reply[] => {
    const replyMap = new Map(flatReplies.map(r => [r.id, {
        ...r,
        author: {
            ...r.author,
            joinDate: new Date(r.author.created_at)
        },
        createdAt: new Date(r.created_at),
        editedAt: r.edited_at ? new Date(r.edited_at) : undefined,
        replies: []
    }]));

    const tree: Reply[] = [];
    for (const reply of replyMap.values()) {
        if (reply.parent_id && replyMap.has(reply.parent_id)) {
            const parent = replyMap.get(reply.parent_id)!;
            parent.replies.push(reply);
            parent.replies.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
        } else {
            tree.push(reply);
        }
    }
    return tree.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, []);

  const fetchPosts = useCallback(async () => {
    const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`*, author:profiles(*)`)
        .not('title', 'ilike', '[DRAFT]%')
        .order('created_at', { ascending: false });

    if (postsError) {
        console.error("Error fetching posts:", postsError.message, postsError);
        throw postsError;
    }
    if (!postsData) return;

    const postIds = postsData.map(p => p.id);
    const { data: repliesData, error: repliesError } = await supabase
        .from('replies')
        .select(`*, author:profiles(*)`)
        .in('post_id', postIds)
        .order('created_at', { ascending: true });
    
    if (repliesError) {
        console.error("Error fetching replies:", repliesError.message, repliesError);
        throw repliesError;
    }

    const postsWithReplies = postsData.map(post => {
        const postReplies = repliesData.filter(r => r.post_id === post.id);
        return {
            ...(post as any),
            author: {
                ...post.author,
                joinDate: new Date(post.author.created_at)
            },
            createdAt: new Date(post.created_at),
            editedAt: post.edited_at ? new Date(post.edited_at) : undefined,
            replies: buildReplyTree(postReplies),
            replyCount: postReplies.length,
            isDraft: false,
        };
    });

    setPosts(postsWithReplies);
  }, [buildReplyTree]);

  const fetchUsers = useCallback(async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
          console.error('Error fetching users:', error.message, error);
          throw error;
      } else if (data) {
          const mappedUsers: User[] = data.map((u: any) => ({
              ...u,
              joinDate: new Date(u.created_at)
          }));
          setUsers(mappedUsers);
      }
  }, []);

  const fetchMyDrafts = useCallback(async (userId: string) => {
    const { data, error } = await supabase
        .from('posts')
        .select(`*, author:profiles(*)`)
        .eq('author_id', userId)
        .like('title', '[DRAFT]%')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching drafts:", error.message, error);
    } else if (data) {
        const mappedDrafts: Post[] = data.map((post: any) => ({
            ...(post as any),
            author: {
                ...post.author,
                joinDate: new Date(post.author.created_at)
            },
            createdAt: new Date(post.created_at),
            editedAt: post.edited_at ? new Date(post.edited_at) : undefined,
            replies: [], // Drafts don't have replies
            replyCount: 0,
            isDraft: true,
            title: post.title.replace(/^\[DRAFT\]\s*/i, ''),
        }));
        setMyDrafts(mappedDrafts);
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
        await Promise.all([fetchPosts(), fetchUsers()]);
    } catch (err: any) {
        console.error("Failed to refresh data:", err.message);
    }
   }, [fetchPosts, fetchUsers]);

   const fetchNotifications = useCallback(async (userId: string) => {
    const { data, error } = await supabase
        .from('notifications')
        .select('*, sender:profiles(*)')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching notifications:", error.message, error);
    } else if (data) {
        const mappedNotifications: Notification[] = data.map((n: any) => ({
            ...n,
            sender: {
                ...n.sender,
                joinDate: new Date(n.sender.created_at)
            },
            created_at: new Date(n.created_at),
        }));
        setNotifications(mappedNotifications);
    }
   }, []);
  
  useEffect(() => {
    const loadInitialData = async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            await Promise.all([fetchPosts(), fetchUsers()]);
        } catch (error: any) {
            setFetchError(`Failed to load forum data. This might be due to a network issue or a problem with the server. (Details: ${error.message})`);
        } finally {
            setIsLoading(false);
        }
    };
    loadInitialData();
  }, [fetchPosts, fetchUsers]);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event: AuthChangeEvent, session: Session | null) => {
            if (session?.user) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    const user = {
                        ...profile,
                        joinDate: new Date(profile.created_at),
                    };
                    setCurrentUser(user);
                    fetchNotifications(user.id);
                    fetchMyDrafts(user.id);
                } else if (error && (error as any).code === 'PGRST116' && session.user.user_metadata?.username) { 
                    // PGRST116: "exact one row not found". This means profile doesn't exist.
                    // We also check for metadata to ensure we can create the profile.
                    const { data: newProfile, error: insertError } = await supabase.from('profiles').insert({
                        id: session.user.id,
                        username: session.user.user_metadata.username,
                        role: session.user.user_metadata.role,
                    }).select().single();

                    if (insertError) {
                        console.error("Error creating profile:", insertError);
                        alert('There was an error creating your user profile. Please try again or contact support.');
                    } else if (newProfile) {
                        const user = {
                            ...newProfile,
                            joinDate: new Date(newProfile.created_at),
                        };
                        setCurrentUser(user);
                        fetchNotifications(user.id);
                        fetchMyDrafts(user.id);
                    }
                } else if (error) {
                    console.error("Error fetching profile:", error);
                }
            } else {
                setCurrentUser(null);
                setNotifications([]);
                setMyDrafts([]);
            }
        }
    );
    return () => subscription.unsubscribe();
  }, [fetchNotifications, fetchMyDrafts]);


  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const handleViewProfile = (userId: string) => {
    if (userId === 'home') {
      setView({ page: 'home' });
    } else {
      setView({ page: 'profile', userId });
    }
  };

  const handleViewDirectory = () => {
    setView({ page: 'directory' });
  };
  
  const parseMentionsAndNotify = useCallback(async (content: string, senderId: string, postId: string, postTitle: string, replyId?: string) => {
    const mentionRegex = /@(\w+)/g;
    const mentionedUsernames = new Set(Array.from(content.matchAll(mentionRegex), m => m[1]));

    if (mentionedUsernames.size === 0) return;

    const { data: mentionedUsers, error } = await supabase
      .from('profiles')
      .select('id, username')
      .in('username', Array.from(mentionedUsernames));
    
    if (error) {
      console.error("Error fetching mentioned users:", error);
      return;
    }

    const notificationPromises = mentionedUsers
      .filter(user => user.id !== senderId) // Don't notify self
      .map(user =>
        supabase.from('notifications').insert({
          recipient_id: user.id,
          sender_id: senderId,
          post_id: postId,
          postTitle: postTitle,
          reply_id: replyId,
          type: NotificationType.MENTION,
        })
      );

    await Promise.all(notificationPromises);

  }, []);

  const handleCreatePost = async (newPostData: { title: string; content: string; subject: Subject }, isDraft: boolean) => {
    if (!currentUser) return;
    const { data, error } = await supabase.from('posts').insert({
        title: isDraft ? `[DRAFT] ${newPostData.title}` : newPostData.title,
        content: newPostData.content,
        subject: newPostData.subject,
        author_id: currentUser.id,
    }).select().single();

    if (error) {
        console.error("Error creating post:", error);
    } else {
        if (isDraft) {
            await fetchMyDrafts(currentUser.id);
        } else {
            await refreshData();
            if(data) {
               await parseMentionsAndNotify(newPostData.content, currentUser.id, data.id, data.title);
            }
        }
    }
  };

  const handleUpdatePost = async (postId: string, updatedData: { title: string; content: string }) => {
    const isDraft = myDrafts.some(d => d.id === postId);
    const titleToUpdate = isDraft ? `[DRAFT] ${updatedData.title}` : updatedData.title;

    const { error } = await supabase.from('posts').update({
        title: titleToUpdate,
        content: updatedData.content,
        edited_at: new Date().toISOString()
    }).eq('id', postId);

    if (error) {
        console.error("Error updating post:", error);
    } else {
        await refreshData();
        if (currentUser) {
            await fetchMyDrafts(currentUser.id);
        }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm(t.deleteConfirm)) {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) {
          console.error("Error deleting post:", error);
      } else {
          await refreshData();
          if (currentUser) {
              await fetchMyDrafts(currentUser.id);
          }
      }
    }
  };

  const handlePublishPost = async (postId: string) => {
    const draft = myDrafts.find(p => p.id === postId);
    if (!draft) {
      console.error("Draft not found to publish");
      return;
    }

    const { data, error } = await supabase.from('posts').update({
        title: draft.title, // This updates title to the version without the [DRAFT] prefix
    }).eq('id', postId).select().single();

    if (error) {
        console.error("Error publishing post:", error);
    } else {
        await refreshData();
        if (currentUser) {
            await fetchMyDrafts(currentUser.id);
             if(data) {
                await parseMentionsAndNotify(data.content, currentUser.id, data.id, data.title);
             }
        }
    }
  };

  const handleTogglePinPost = async (postId: string) => {
    if (currentUser?.role !== UserRole.TEACHER) return;
    const postToUpdate = posts.find(p => p.id === postId);
    if (!postToUpdate) return;
    const { error } = await supabase.from('posts').update({ pinned: !postToUpdate.pinned }).eq('id', postId);
    if (error) {
      console.error("Error pinning post:", error);
    } else {
      await refreshData();
    }
  };

  const handleToggleLockPost = async (postId: string) => {
    if (currentUser?.role !== UserRole.TEACHER) return;
    const postToUpdate = posts.find(p => p.id === postId);
    if (!postToUpdate) return;
    const { error } = await supabase.from('posts').update({ locked: !postToUpdate.locked }).eq('id', postId);
    if (error) {
      console.error("Error locking post:", error);
    } else {
      await refreshData();
    }
  };
  
  const handleCreateReply = async (parentId: string, content: string) => {
      if (!currentUser) return;
      
      let post: Post | undefined;
      let parentReply: Reply | undefined;

      const findPost = (id: string): Post | undefined => posts.find(p => p.id === id);
      const findReplyRecursive = (replies: Reply[], id: string): Reply | undefined => {
        for (const r of replies) {
          if (r.id === id) return r;
          const found = findReplyRecursive(r.replies, id);
          if (found) return found;
        }
        return undefined;
      };

      post = findPost(parentId);
      if (!post) {
        for (const p of posts) {
            parentReply = findReplyRecursive(p.replies, parentId);
            if (parentReply) {
                post = p;
                break;
            }
        }
      }

      if (!post) {
        console.error("Could not find post context for reply");
        return;
      }

      const isDirectReplyToPost = post.id === parentId;
      
      const { data: newReply, error } = await supabase.from('replies').insert({
          content,
          author_id: currentUser.id,
          post_id: post.id,
          parent_id: isDirectReplyToPost ? null : parentId,
      }).select().single();

      if (error) {
          console.error("Error creating reply:", error);
      } else {
          await refreshData();
          // Create notifications
          if (isDirectReplyToPost) {
              if (post.author.id !== currentUser.id) {
                await supabase.from('notifications').insert({ recipient_id: post.author.id, sender_id: currentUser.id, post_id: post.id, postTitle: post.title, reply_id: newReply.id, type: NotificationType.POST_REPLY });
              }
          } else if (parentReply) {
              if (parentReply.author.id !== currentUser.id) {
                 await supabase.from('notifications').insert({ recipient_id: parentReply.author.id, sender_id: currentUser.id, post_id: post.id, postTitle: post.title, reply_id: newReply.id, type: NotificationType.REPLY_REPLY });
              }
          }
          await parseMentionsAndNotify(content, currentUser.id, post.id, post.title, newReply.id);
      }
  };

  const handleUpdateReply = async (replyId: string, content: string) => {
      const { error } = await supabase.from('replies').update({
          content: content.trim(),
          edited_at: new Date().toISOString(),
      }).eq('id', replyId);
      if (error) {
          console.error("Error updating reply:", error);
      } else {
          await refreshData();
      }
  };

  const handleDeleteReply = async (replyId: string) => {
      if (window.confirm(t.deleteConfirm)) {
          const { error } = await supabase.from('replies').delete().eq('id', replyId);
          if (error) {
              console.error("Error deleting reply:", error);
          } else {
              await refreshData();
          }
      }
  };

  const handleLogin = async (credentials: { email: string; password: string; role: UserRole }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
    });

    if (error) {
        alert(t.invalidCredentials);
        return;
    }

    if (data.user) {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

        if (profileError || !profile || profile.role !== credentials.role) {
            await supabase.auth.signOut();
            alert(t.invalidCredentials);
        } else {
            setIsLoginModalOpen(false);
        }
    }
  };

  const handleRegister = async (registrationData: { email: string; username: string; password: string; role: UserRole }) => {
    const { data, error: authError } = await supabase.auth.signUp({
        email: registrationData.email,
        password: registrationData.password,
        options: {
            data: {
                username: registrationData.username,
                role: registrationData.role,
            },
            emailRedirectTo: window.location.origin,
        },
    });

    if (authError) {
        alert(authError.message);
        return;
    }
    
    if (data.user) {
        if (data.session) {
             // User is logged in automatically (email confirmation is off)
            setIsLoginModalOpen(false);
        } else {
            // User needs to confirm their email
            alert("Registration successful! Please check your email to verify your account before logging in.");
            setIsLoginModalOpen(false);
        }
    }
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setView({ page: 'home' });
  }

  const handleUpdateUser = async (userId: string, updatedData: Partial<User>) => {
    const { error } = await supabase.from('profiles').update(updatedData).eq('id', userId);
    if(error){
        console.error("Error updating user:", error);
    } else {
        await refreshData();
    }
  };


  const handleUpdateProfile = async (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const { error } = await supabase.from('profiles').update(updatedData).eq('id', currentUser.id);
    if(error){
        console.error("Error updating profile:", error);
    } else {
        setCurrentUser(prev => prev ? { ...prev, ...updatedData } : null);
        setIsEditProfileModalOpen(false);
        await refreshData();
    }
  };

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
    if (error) {
      console.error("Error marking notification as read:", error);
    } else {
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    }
  };
  
  const handleMarkAllNotificationsAsRead = async () => {
    if (!currentUser) return;
    const { error } = await supabase.from('notifications').update({ read: true }).eq('recipient_id', currentUser.id).eq('read', false);
    if (error) {
      console.error("Error marking all notifications as read:", error);
    } else {
      setNotifications(notifications.map(n => ({...n, read: true })));
    }
  };


  const filteredAndSortedPosts = useMemo(() => {
    const subjectFilteredPosts = selectedSubject === Subject.ALL
      ? posts
      : posts.filter(post => post.subject === selectedSubject);
    
    const pinned = subjectFilteredPosts.filter(p => p.pinned).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const unpinned = subjectFilteredPosts.filter(p => !p.pinned);

    const sortedUnpinned = [...unpinned].sort((a, b) => {
      if (sortOrder === 'mostReplied') {
        return (b.replyCount || 0) - (a.replyCount || 0);
      } else if (sortOrder === 'newest') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else { // oldest
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
    });

    return [...pinned, ...sortedUnpinned];
  }, [posts, selectedSubject, sortOrder]);

  const userNotifications = useMemo(() => {
    if (!currentUser) return [];
    return notifications
      .filter(n => n.recipient_id === currentUser.id)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }, [notifications, currentUser]);

  const profileUser = view.page === 'profile' ? users.find(u => u.id === view.userId) : null;
  const profileUserPosts = view.page === 'profile' ? posts.filter(p => p.author.id === view.userId) : [];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    if (fetchError) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">Failed to load content</strong>
            <p className="block sm:inline mt-1">{fetchError}</p>
          </div>
        </div>
      );
    }

    if (view.page === 'home') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <Sidebar 
              subjects={SUBJECTS} 
              selectedSubject={selectedSubject} 
              onSelectSubject={setSelectedSubject}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
              onViewDirectory={handleViewDirectory}
              currentView={view.page}
            />
          </aside>
          <div className="md:col-span-3 space-y-6">
            <PostForm currentUser={currentUser} onCreatePost={handleCreatePost} />
            <div className="space-y-6">
              {filteredAndSortedPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  currentUser={currentUser}
                  onUpdatePost={handleUpdatePost}
                  onDeletePost={handleDeletePost}
                  onCreateReply={handleCreateReply}
                  onUpdateReply={handleUpdateReply}
                  onDeleteReply={handleDeleteReply}
                  onViewProfile={handleViewProfile}
                  onTogglePinPost={handleTogglePinPost}
                  onToggleLockPost={handleToggleLockPost}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    if (view.page === 'profile' && profileUser) {
      const isOwnProfile = currentUser?.id === profileUser.id;
      return (
        <ProfilePage
          user={profileUser}
          posts={profileUserPosts}
          drafts={isOwnProfile ? myDrafts : []}
          currentUser={currentUser}
          onEditProfile={() => setIsEditProfileModalOpen(true)}
          onViewProfile={handleViewProfile}
          onUpdatePost={handleUpdatePost}
          onDeletePost={handleDeletePost}
          onPublishPost={handlePublishPost}
          onCreateReply={handleCreateReply}
          onUpdateReply={handleUpdateReply}
          onDeleteReply={handleDeleteReply}
          onTogglePinPost={handleTogglePinPost}
          onToggleLockPost={handleToggleLockPost}
        />
      );
    }

    if (view.page === 'directory') {
      return (
        <UserDirectory 
          users={users}
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
          onViewProfile={handleViewProfile}
        />
      );
    }

    return null;
  }

  return (
    <div className="flex flex-col min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header 
        currentUser={currentUser} 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        onLogoutClick={handleLogout}
        onViewProfile={handleViewProfile}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        notifications={userNotifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
      />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {renderContent()}
      </main>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
      {currentUser && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          onSave={handleUpdateProfile}
          currentUser={currentUser}
        />
      )}
      <Footer />
    </div>
  );
};

export default App;