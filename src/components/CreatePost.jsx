// src/components/CreatePost.jsx
import React, { useState } from 'react';
import postService from '../services/postService';
import { useNavigate } from 'react-router-dom';

// --- Импорты React Bootstrap ---
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
// --- Конец импортов ---

function CreatePost() {
    // Состояния и обработчик handleSubmit остаются БЕЗ ИЗМЕНЕНИЙ
    const [content, setContent] = useState('');
    const [songUrl, setSongUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        if (!content.trim()) {
            setError("Post content cannot be empty.");
            return;
        }
        setLoading(true);
        const postData = { content: content, songUrl: songUrl.trim() || null };
        try {
            await postService.createPost(postData);
            setSuccessMessage("Post created successfully! Redirecting...");
            setContent(''); setSongUrl('');
            // setLoading(false); // Можно убрать, т.к. идет редирект
            setTimeout(() => { navigate('/'); }, 1500);
        } catch (err) {
            const message = (err.response?.data?.message) || err.message || "Failed to create post.";
            setError(message);
            setLoading(false); // Оставляем при ошибке
        }
    };

    // --- ИЗМЕНЕННЫЙ РЕНДЕРИНГ ---
    return (
        <Container className="mt-4"> {/* Отступ сверху */}
             <Row className="justify-content-md-center">
                {/* Используем более широкую колонку для формы поста */}
                 <Col xs={12} md={10} lg={8}>
                    <h2 className="mb-4">Create New Post</h2>
                    <Form onSubmit={handleSubmit}>
                        {/* Поле Content */}
                        <Form.Group className="mb-3" controlId="createPostContent">
                            <Form.Label>Your Mood / Thoughts:</Form.Label>
                            <Form.Control
                                as="textarea" // Используем тип textarea
                                rows={5} // Высота поля
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What's on your mind? How are you feeling?"
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        {/* Поле Song URL */}
                        <Form.Group className="mb-3" controlId="createPostSongUrl">
                            <Form.Label>Song URL (Spotify, YouTube Music, etc.) - Optional:</Form.Label>
                            <Form.Control
                                type="url"
                                value={songUrl}
                                onChange={(e) => setSongUrl(e.target.value)}
                                placeholder="https://..."
                                disabled={loading}
                            />
                             <Form.Text className="text-muted">
                                 Paste the link to the song that matches your mood.
                             </Form.Text>
                        </Form.Group>

                        {/* Сообщения об успехе/ошибке */}
                        {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
                        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                        {/* Кнопка отправки */}
                        <Button variant="primary" type="submit" disabled={loading} className="mt-3">
                            {loading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                                    <span className="ms-2">Creating Post...</span>
                                </>
                            ) : (
                                'Create Post'
                            )}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default CreatePost;