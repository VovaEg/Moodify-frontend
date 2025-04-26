// src/components/PostCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Импорт для ссылки Edit
import postService from '../services/postService';
import authService from '../services/authService';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

// Импортируем компоненты React Bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'; // Для ошибок

function PostCard({ post, onPostDeleted }) {
    // Состояния
    const currentUser = authService.getCurrentUser();
    const [currentLikeCount, setCurrentLikeCount] = useState(post.likeCount);
    const [isLoadingLike, setIsLoadingLike] = useState(false);
    const [likeError, setLikeError] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [currentCommentCount, setCurrentCommentCount] = useState(post.commentCount);
    const [refreshCommentListKey, setRefreshCommentListKey] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // Проверки прав
    const isAuthor = currentUser && post.author && currentUser.id === post.author.id;
    const isAdmin = currentUser && Array.isArray(currentUser.roles) && currentUser.roles.includes('ROLE_ADMIN');

    // --- Обработчики Лайков ---
    const handleLike = async () => {
        if (!currentUser || isLoadingLike) return;
        setIsLoadingLike(true); setLikeError(null);
        try {
            const response = await postService.likePost(post.id);
            setCurrentLikeCount(response.data.likeCount);
        } catch (err) {
            console.error("Failed to like post:", err);
            setLikeError(err.response?.data?.message || "Failed to like post.");
        } finally { setIsLoadingLike(false); }
    };
    const handleUnlike = async () => {
        if (!currentUser || isLoadingLike) return;
        setIsLoadingLike(true); setLikeError(null);
        try {
            const response = await postService.unlikePost(post.id);
            setCurrentLikeCount(response.data.likeCount);
        } catch (err) {
            console.error("Failed to unlike post:", err);
            setLikeError(err.response?.data?.message || "Failed to unlike post.");
        } finally { setIsLoadingLike(false); }
    };

    // --- Обработчики Комментариев ---
    const handleCommentAdded = () => {
        setCurrentCommentCount(count => count + 1);
        setRefreshCommentListKey(prevKey => prevKey + 1);
    };
    const handleCommentDeleted = (deletedCommentId) => {
        setCurrentCommentCount(count => Math.max(0, count - 1));
        setRefreshCommentListKey(prevKey => prevKey + 1);
    };

     // --- Обработчик Удаления Поста ---
     const handleDeletePost = async () => {
        if (!(isAuthor || isAdmin) || isDeleting) return;
        if (!window.confirm(`Are you sure you want to delete this post? "${post.content.substring(0, 30)}..."`)) return;
        setIsDeleting(true); setDeleteError(null);
        try {
            await postService.deletePost(post.id);
            console.log(`PostCard: Post ${post.id} deleted successfully by user ${currentUser.username}.`);
            onPostDeleted(post.id);
        } catch (err) {
            console.error(`PostCard: Failed to delete post ${post.id}`, err);
            setDeleteError(err.response?.data?.message || "Failed to delete post.");
            setIsDeleting(false);
        }
    };

    // --- Форматирование Даты ---
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try { return new Date(dateString).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } // Формат покороче
        catch (error) { return dateString; }
    };

    // --- Рендеринг Компонента ---
    return (
        // Используем компонент Card
        <Card className="mb-3 shadow-sm">
            {/* Шапка Карточки */}
            <Card.Header className="d-flex justify-content-between align-items-start bg-light">
                <div>
                    <Card.Subtitle className="mb-1 text-muted" style={{fontSize: '0.9em'}}>
                        @{post.author?.username || 'Unknown User'}
                    </Card.Subtitle>
                    <small className="text-muted">{formatDate(post.createdAt)}</small>
                </div>
                {/* Кнопки управления постом (только для автора или админа) */}
                {(isAuthor || isAdmin) && (
                    <div className='post-actions'>
                        {isAuthor && (
                           <Link
                               to={`/posts/${post.id}/edit`}
                               className="btn btn-sm btn-outline-secondary me-2" // Ссылка как кнопка
                               title="Edit Post"
                           >
                               Edit
                           </Link>
                        )}
                        <Button
                            variant="outline-danger" // Красная контурная
                            size="sm" // Маленький размер
                            onClick={handleDeletePost}
                            disabled={isDeleting}
                            title="Delete Post"
                        >
                            {isDeleting ? '...' : 'Delete'}
                        </Button>
                    </div>
                )}
            </Card.Header>

             {/* Тело Карточки */}
            <Card.Body>
                {deleteError && <Alert variant="danger" size="sm" className="py-1 px-2 small">{deleteError}</Alert>} {/* Ошибка удаления */}
                <Card.Text style={{ whiteSpace: 'pre-wrap' }}>{post.content}</Card.Text> {/* whiteSpace для сохранения переносов строк */}
                {post.songUrl && (
                    <div className="mt-2">
                        <small className="text-muted">Song:</small>
                        <Card.Link href={post.songUrl} target="_blank" rel="noopener noreferrer" className="d-block text-truncate">
                             {post.songUrl}
                        </Card.Link>
                    </div>
                )}
            </Card.Body>

            {/* Футер Карточки */}
            <Card.Footer className="d-flex justify-content-between align-items-center bg-light text-muted small">
                 {/* Счетчики */}
                <div style={{display: 'flex', gap: '15px'}}>
                    <span>{currentLikeCount} Likes</span>
                    <span>{currentCommentCount} Comments</span>
                </div>
                 {/* Кнопки действий */}
                <div>
                    <Button variant="outline-primary" size="sm" onClick={handleLike} disabled={!currentUser || isLoadingLike} className="me-1" title={!currentUser ? "Login to like" : "Like"} >
                        👍 {isLoadingLike && !isDeleting ? '...' : ''}
                    </Button>
                    <Button variant="outline-secondary" size="sm" onClick={handleUnlike} disabled={!currentUser || isLoadingLike} className="me-2" title={!currentUser ? "Login to unlike" : "Unlike"} >
                        👎 {isLoadingLike && !isDeleting ? '...' : ''}
                    </Button>
                    <Button variant="outline-info" size="sm" onClick={() => setShowComments(!showComments)} title={showComments ? "Hide Comments" : "Show Comments"} >
                        💬 ({currentCommentCount})
                    </Button>
                </div>
            </Card.Footer>

            {/* Отображение ошибки лайка */}
            {likeError && <Alert variant="danger" className="m-2 py-1 px-2 small">{likeError}</Alert>}

            {/* Секция Комментариев */}
            {showComments && (
                <div className="comment-section p-3 border-top">
                    <CommentList
                        key={refreshCommentListKey}
                        postId={post.id}
                        onDelete={handleCommentDeleted}
                    />
                    <CommentForm
                        postId={post.id}
                        onCommentSubmitted={handleCommentAdded}
                    />
                </div>
            )}
        </Card>
    );
}

export default PostCard;