// src/components/EditPost.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import postService from '../services/postService';
import authService from '../services/authService';

// --- Импорты React Bootstrap ---
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
// --- Конец импортов ---


function EditPost() {
    const { postId } = useParams();
    const navigate = useNavigate();

    // Состояния (без изменений)
    const [content, setContent] = useState('');
    const [songUrl, setSongUrl] = useState('');
    const [initialLoading, setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

     // useEffect для загрузки данных поста (без изменений)
    useEffect(() => {
        const fetchPostData = async () => {
            setInitialLoading(true); setError(null); setIsAuthorized(false);
            try {
                const currentUser = authService.getCurrentUser();
                if (!currentUser) { navigate('/login'); return; }
                const response = await postService.getPostById(postId);
                const postData = response.data;
                if (postData.author && postData.author.id === currentUser.id) {
                    setIsAuthorized(true);
                    setContent(postData.content);
                    setSongUrl(postData.songUrl || '');
                } else {
                    setIsAuthorized(false);
                    setError("You are not authorized to edit this post.");
                }
            } catch (err) {
                const message = (err.response?.data?.message) || err.message || "Failed to load post data.";
                 if (err.response && err.response.status === 404) { setError(`Post with ID ${postId} not found.`); }
                 else { setError(message); }
                setIsAuthorized(false);
            } finally { setInitialLoading(false); }
        };
        fetchPostData();
    }, [postId, navigate]);

    // Обработчик отправки формы (логика без изменений)
    const handleSubmit = async (e) => {
         e.preventDefault(); setError(null); setSuccessMessage(null);
         if (!content.trim()) { setError("Post content cannot be empty."); return; }
         if (!isAuthorized) { setError("Authorization failed."); return; }
         setLoading(true);
         const updatedData = { content: content, songUrl: songUrl.trim() || null };
         try {
             await postService.updatePost(postId, updatedData);
             setSuccessMessage("Post updated successfully! Redirecting...");
             // setLoading(false); // Убираем, т.к. идет редирект
             setTimeout(() => { navigate('/'); }, 1500);
         } catch (err) {
             const message = (err.response?.data?.message) || err.message || "Failed to update post.";
             setError(message);
             setLoading(false);
         }
    };


    // --- ИЗМЕНЕННЫЙ РЕНДЕРИНГ ---
    if (initialLoading) { // Показываем загрузку данных поста
         return (
            <Container className="text-center mt-5">
                <Spinner animation="border" /> <p>Loading post data...</p>
            </Container>
        );
    }

    if (error && !isAuthorized) { // Показываем ошибку авторизации или загрузки
        return (
            <Container className="mt-3">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }
    // Не рендерим форму, если не авторизован (выше уже есть обработка ошибки)
    // if (!isAuthorized) return null; // Или можно оставить сообщение об ошибке

    // Если все ок - показываем форму редактирования
    return (
         <Container className="mt-4">
             <Row className="justify-content-md-center">
                 <Col xs={12} md={10} lg={8}>
                    <h2 className="mb-4">Edit Post</h2>
                    <Form onSubmit={handleSubmit}>
                        {/* Поле Content */}
                        <Form.Group className="mb-3" controlId="editPostContent">
                            <Form.Label>Content:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={content} // Предзаполнено
                                onChange={(e) => setContent(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        {/* Поле Song URL */}
                        <Form.Group className="mb-3" controlId="editPostSongUrl">
                            <Form.Label>Song URL (Optional):</Form.Label>
                            <Form.Control
                                type="url"
                                value={songUrl} // Предзаполнено
                                onChange={(e) => setSongUrl(e.target.value)}
                                placeholder="https://..."
                                disabled={loading}
                            />
                        </Form.Group>

                        {/* Сообщения об успехе/ошибке отправки */}
                        {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
                        {/* Показываем ошибку отправки (если она отличается от ошибки загрузки) */}
                        {error && isAuthorized && <Alert variant="danger" className="mt-3">{error}</Alert>}

                        {/* Кнопка отправки */}
                        <Button variant="primary" type="submit" disabled={loading} className="mt-3">
                            {loading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                                    <span className="ms-2">Updating Post...</span>
                                </>
                            ) : (
                                'Update Post'
                            )}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default EditPost;