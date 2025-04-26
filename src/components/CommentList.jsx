// src/components/CommentList.jsx
import React, { useState, useEffect } from 'react';
import postService from '../services/postService';
import CommentItem from './CommentItem';
import authService from '../services/authService';

// --- Импорты React Bootstrap ---
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
// import ListGroup from 'react-bootstrap/ListGroup'; // Вариант с ListGroup
// --- Конец импортов ---

function CommentList({ postId, onDelete }) {
    // Состояния и useEffect остаются без изменений
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true); setError(null);
            console.log(`CommentList: Fetching comments for post ${postId}, page ${page}`);
            try {
                const response = await postService.getComments(postId, page, 5); // Загружаем по 5
                setComments(response.data.content);
            } catch (err) {
                console.error(`CommentList: Failed to fetch comments for post ${postId}`, err);
                const message = (err.response?.data?.message) || "Failed to load comments";
                setError(message); setComments([]);
            } finally { setLoading(false); }
        };
        if (postId) fetchComments();
         else { setLoading(false); setComments([]); setError("Post ID is missing."); }
    }, [postId, page]);

    // --- ИЗМЕНЕННЫЙ РЕНДЕРИНГ ---

    if (loading) {
        // Используем Spinner
        return (
            <div className="text-center p-2"> {/* Центрируем */}
                <Spinner animation="border" size="sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        // Используем Alert
        return <Alert variant="warning" className="mt-2 py-1 px-2 small">Error: {error}</Alert>;
    }

    return (
         // Оставляем div или можно использовать ListGroup (см. ниже)
        <div className="comment-list mt-2"> {/* Добавим отступ сверху */}
            {comments.length === 0 ? (
                <p className="text-muted small ms-1">No comments yet.</p> // Стилизуем текст
            ) : (
                comments.map(comment => (
                    // CommentItem стилизуем отдельно
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        currentUser={currentUser}
                        onDelete={onDelete}
                    />
                ))
            )}
             {/* TODO: Пагинация */}
        </div>

        // --- АЛЬТЕРНАТИВА с ListGroup ---
        /*
        <ListGroup variant="flush" className="mt-2"> // flush убирает рамки
            {comments.length === 0 ? (
                <ListGroup.Item className="text-muted small">No comments yet.</ListGroup.Item>
            ) : (
                comments.map(comment => (
                    <CommentItem // CommentItem тогда тоже нужно будет обернуть в <ListGroup.Item>
                        key={comment.id}
                        comment={comment}
                        currentUser={currentUser}
                        onDelete={onDelete}
                    />
                ))
            )}
        </ListGroup>
        */
        // --- КОНЕЦ АЛЬТЕРНАТИВЫ ---
    );
}
export default CommentList;