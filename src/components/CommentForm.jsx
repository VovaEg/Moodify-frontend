// src/components/CommentForm.jsx
import React, { useState } from 'react';
import postService from '../services/postService';
import authService from '../services/authService';

// --- Импорты React Bootstrap ---
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
// --- Конец импортов ---


function CommentForm({ postId, onCommentSubmitted }) {
    // Состояния и обработчик handleSubmit остаются без изменений
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const currentUser = authService.getCurrentUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting || !currentUser) return;
        setIsSubmitting(true); setError(null);
        try {
            await postService.createComment(postId, { content });
            console.log(`CommentForm: Comment submitted successfully for post ${postId}`);
            setContent('');
            onCommentSubmitted();
        } catch (err) {
            console.error(`CommentForm: Failed to submit comment for post ${postId}`, err);
            setError(err.response?.data?.message || "Failed to submit comment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- ИЗМЕНЕННЫЙ РЕНДЕРИНГ ---
    // Не рендерим форму, если пользователь не вошел
    if (!currentUser) {
        return <p className="text-muted ms-2 small">Please login to comment.</p>; // Используем Bootstrap классы
    }

    // Рендерим форму с компонентами Bootstrap
    return (
        // Используем Form от React Bootstrap
        <Form onSubmit={handleSubmit} className="mt-3 ms-1"> {/* Отступы Bootstrap */}
            {/* Используем Form.Group */}
            <Form.Group controlId={`commentForm-${postId}`}> {/* Уникальный ID для control */}
                <Form.Control
                    as="textarea" // Тип поля - textarea
                    rows={2} // Высота
                    placeholder="Add your comment..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="mb-2" // Отступ снизу
                />
            </Form.Group>

            {/* Кнопка отправки */}
            <Button variant="primary" type="submit" size="sm" disabled={isSubmitting || !content.trim()}>
                {isSubmitting ? (
                    <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                        <span className="ms-1">Submitting...</span>
                    </>
                ) : (
                    'Submit Comment'
                )}
            </Button>

            {/* Сообщение об ошибке */}
            {error && (
                <Alert variant="danger" className="mt-2 mb-0 py-1 px-2 small"> {/* Компактный Alert */}
                    Error: {error}
                </Alert>
            )}
        </Form>
    );
}

export default CommentForm;