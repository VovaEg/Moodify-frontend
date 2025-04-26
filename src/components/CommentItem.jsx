// src/components/CommentItem.jsx
import React, { useState } from 'react';
import authService from '../services/authService';
import postService from '../services/postService';

// --- Импорты React Bootstrap ---
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
// --- Конец импортов ---


function CommentItem({ comment, currentUser, onDelete }) {
    // Состояния и проверка isAuthor/isAdmin остаются без изменений
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    const isAuthor = currentUser && comment.author && currentUser.id === comment.author.id;
    const isAdmin = currentUser && Array.isArray(currentUser.roles) && currentUser.roles.includes('ROLE_ADMIN');

    // handleDelete остается без изменений
    const handleDelete = async () => {
         if (!(isAuthor || isAdmin) || isDeleting) return;
         if (!window.confirm("Are you sure you want to delete this comment?")) return;
         setIsDeleting(true); setError(null);
        try {
            await postService.deleteComment(comment.id);
            onDelete(comment.id);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete comment.");
            setIsDeleting(false); // Оставляем кнопку при ошибке
        }
        // Не сбрасываем isDeleting при успехе, т.к. компонент исчезнет
    };

    // Форматирование даты (можно улучшить)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try { return new Date(dateString).toLocaleString('uk-UA', { hour: '2-digit', minute: '2-digit' }); } // Более короткий формат времени
        catch (error) { return dateString; }
    };

    // --- ИЗМЕНЕННЫЙ РЕНДЕРИНГ ---
    return (
        // Используем классы Bootstrap для отступов и границы
        <div className="comment-item mb-2 pb-2 border-bottom position-relative"> {/* Отступ снизу, линия снизу, относительное позиционирование для кнопки */}
            {/* Заголовок комментария */}
            <div className="comment-item-header small"> {/* Делаем текст мельче */}
                <strong className="me-2"> {/* Отступ справа */}
                    {comment.author?.username || 'User'}
                </strong>
                <span className="text-muted"> {/* Приглушенный цвет */}
                    {formatDate(comment.createdAt)}
                </span>
            </div>
            {/* Текст комментария */}
             {/* Добавляем отступ сверху */}
            <p className="mb-0 mt-1">{comment.content}</p>

             {/* Кнопка удаления (автор или админ) */}
            {(isAuthor || isAdmin) && (
                // Стилизуем кнопку и позиционируем абсолютно
                <Button
                    variant="outline-danger" // Красная контурная
                    size="sm" // Очень маленький размер
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="position-absolute top-0 end-0 p-0 px-1 lh-1 border-0" // Классы Bootstrap для позиции, паддинга, высоты строки, убираем рамку
                    style={{lineHeight: '1', padding: '1px 3px!important'}} // Доп. стили для маленькой кнопки X
                    title="Delete comment"
                >
                     {isDeleting ? '...' : '×'} {/* Используем символ крестика */}
                </Button>
            )}
             {/* Сообщение об ошибке */}
             {error && <Alert variant="danger" className="mt-1 mb-0 py-1 px-2 small">{error}</Alert>}
        </div>

        // --- Альтернатива с ListGroup.Item (если CommentList использует ListGroup) ---
        /*
        <ListGroup.Item as="div" className="comment-item px-0 py-2 border-0 border-bottom position-relative"> // Убираем паддинги и рамки ListGroup.Item, добавляем свою границу
             <div className="comment-item-header small"> ... </div>
             <p className="mb-0 mt-1">{comment.content}</p>
             {(isAuthor || isAdmin) && ( <Button ... /> )}
             {error && <Alert...>Error: {error}</Alert>}
        </ListGroup.Item>
        */
       // --- Конец Альтернативы ---
    );
}

export default CommentItem;